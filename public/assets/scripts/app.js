// Abordagem FETCH
const ApiKey = 'aa5972b8b4d71abf31178c742ccc15a7';
const ApiFavoritos = '/favoritos'
const ApiProfile = '/profile'

var db_fav = [];


function ExibeSerie() {
  fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${ApiKey}&language=pt-BR&`)
    .then(res => res.json())
    .then(data => {
      let str = ''
      for (let i = 0; i < 12; i++) {
        let serie = data.results[i]
        str += `<a href="serie.html?id=${serie.id}" class="col-md-2  linkcard"><div>
                        <div class="card mb-4">
                        <img src="https://image.tmdb.org/t/p/original/${serie.poster_path}" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${serie.original_name}</h5>
                                <p class="card-text">Popularidade ${calcularPorcentagem(serie.popularity)}% <br>${serie.first_air_date}</p>
                            </div>
                        </div>
                    </div></a>`
      }
      console.log(data.results.length)
      document.getElementById('NovasSeries').innerHTML = str
    })
}
function ExplorarSerie() {
  fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${ApiKey}&language=pt-BR&page=1`)
    .then(res => res.json())
    .then(data => {
      let str = ''
      for (let i = 0; i < 18; i++) {
        let serie = data.results[i]
        str += `<a href="serie.html?id=${serie.id}" class="col-md-2 linkcard"><div>
                        <div class="card mb-4">
                        <img src="https://image.tmdb.org/t/p/original/${serie.poster_path}" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text">Popularidade ${calcularPorcentagem(serie.popularity)}%<br>${serie.first_air_date}</p>
                            </div>
                        </div>
                    </div></a>`
      }
      console.log(data.results.length)
      document.getElementById('ExplorarSerie').innerHTML = str
    })
}

function ExibeElenco() {
  const URLPage = new URLSearchParams(window.location.search);
  const ID = URLPage.get("id");
  const url = 'https://api.themoviedb.org/3/tv/' + ID + '/credits?language=pt-BR';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTU5NzJiOGI0ZDcxYWJmMzExNzhjNzQyY2NjMTVhNyIsIm5iZiI6MTczMjU2NjI5OS43MzUxOTQ3LCJzdWIiOiI2NzQ0YzQ3MmNjMWQ2OTk4NmJkOWU0M2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hH90tby77qZb9K7sv4idaDe0NJxx1nNXgnV1_xtn3gY'
    }
  };



  fetch(url, options)
    .then(res => res.json())
    .then(data => {
      if (!data.cast || data.cast.length === 0) {
        document.getElementById('elenco').innerHTML = '<h2>Não há elenco nessa série!</h2>';
        return;
      }
      let str = `<div class="carousel-item active">
            <div class="row">
              `

      for (let j = 0; j < data.cast.length; j++) {
        if (j % 4 == 0 && j !== 0) {
          str += `</div></div><div class="carousel-item"><div class="row">`;
        }
        let serie = data.cast[j]
        if (serie && serie.profile_path) {
          str += `<div class="col-md-3">
                                <div class="card mb-3">
                                <img src="https://image.tmdb.org/t/p/w500${serie.profile_path}" id="img_card_detalhe" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title">${serie.name}</h5>
                                    </div>
                                </div>
                            </div>`
        } else {
          str += `<div class="col-md-3">
                  <div class="card mb-3">
                   <img src="./assets/img/SerieExemplo.png" id="img_card_detalhe" class="card-img-top" alt="...">
                      <div class="card-body">
                          <h5 class="card-title">${serie.name}</h5>
                      </div>
                  </div>
              </div>`
        }
      }
      str += `</div></div>`


      console.log(data.cast.length)
      document.getElementById('elenco').innerHTML = str
    })
    .catch(error => {
      console.error('Erro:', error);
      
    });
}
async function ExibeDetalhes() {
  const URLPage = new URLSearchParams(window.location.search);
  const ID = URLPage.get("id");
  const url = `https://api.themoviedb.org/3/tv/${ID}?language=pt-BR`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTU5NzJiOGI0ZDcxYWJmMzExNzhjNzQyY2NjMTVhNyIsIm5iZiI6MTczMjU2NjI5OS43MzUxOTQ3LCJzdWIiOiI2NzQ0YzQ3MmNjMWQ2OTk4NmJkOWU0M2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hH90tby77qZb9K7sv4idaDe0NJxx1nNXgnV1_xtn3gY'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Erro ao buscar detalhes da série");
    }
    const data = await response.json();

    const favorito = await verificafav(ID); // Aguarda o resultado do ícone de favorito

    const str = `
      <img src="${data.backdrop_path ? `https://image.tmdb.org/t/p/original/${data.backdrop_path}` : './assets/img/SerieExemplo.png'}" 
           class="img-fluid w-100" alt="Imagem da Série">
      <div class="overlay position-absolute top-0 start-0 w-100 h-100">
        <div class="container-fluid bgzin2 text-overlay text-white p-4">
          <h1 class="display-4">${data.name || "Título não disponível"}</h1>
          <p class="lead fs-6">${data.overview || "Descrição não disponível"}</p>
          <div class="container-fluid text-end">
            ${favorito}
          </div>
        </div>
      </div>`;

    document.getElementById('ExibeDetalhes').innerHTML = str;
    
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function verificafav(idserie) {
  try {
    const response = await fetch(ApiFavoritos);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados de Favoritos");
    }
    const data = await response.json();

    // Verificar se a série está nos favoritos
    for (let i = 0; i < data.length; i++) {
      if (idserie == data[i].idtmdb) {
        return '<button type="button" onclick="desfavoritar()" id="likeButton" class="like-btn"><i class="bi bi-heart-fill"></i></button>';

      }
    }
    return '<button type="button" onclick="favoritar();SeriesFav()" id="likeButton" class="like-btn"><i class="bi bi-heart"></i></button>'; // Não favoritada
  } catch (error) {
    console.error("Erro:", error);
    return '<button type="button" onclick="favoritar();SeriesFav()" id="likeButton" class="like-btn"><i class="bi bi-heart"></i></button>'; // Retorna o estado "não favoritado" como fallback
  }
}
function desfavoritar() {
  const URLPage = new URLSearchParams(window.location.search);
  const ID = URLPage.get("id");
  
  fetch(ApiFavoritos)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados de usuários");
      }
      return response.json();
    })
    .then(data => {
      for (let i = 0; i<=data.length; i++){
        if(data[i].idtmdb == ID){
          const url = `${ApiFavoritos}/${data[i].id}`;
          fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`Erro ao excluir o favorito: ${response.statusText}`);
              }
              window.location.reload(true);
            })
            .catch(err => {
              console.error('Erro ao remover dos favoritos:', err);
            });
        }
      }
})
}

function BuscaSerie(event) {
  event.preventDefault();
  var nomeDaSerie = document.getElementById('inputBuscar').value;
  if (nomeDaSerie == '') {
    return ExplorarSerie();
  } else {
    fetch(`https://api.themoviedb.org/3/search/tv?api_key=${ApiKey}&language=pt-BR&query=${nomeDaSerie}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Erro na API');
        }
        return res.json();
      })
      .then(data => {
        if (!data.results || data.results.length === 0) {
          document.getElementById('NovasSeries').innerHTML = '<p>Nenhuma série encontrada.</p>';
          return;
        }

        let str = '';
        const maxResults = Math.min(12, data.results.length);
        for (let i = 0; i < maxResults; i++) {
          let serie = data.results[i];
          if (serie && serie.id && serie.poster_path) {
            str += `<a href="serie.html?id=${serie.id}" class="col-md-2 linkcard"><div>
                        <div class="card mb-4">
                        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text">Popularidade ${calcularPorcentagem(serie.popularity)}%<br>${serie.first_air_date}</p>
                            </div>
                        </div>
                    </div></a>`;
          }
        }
        document.getElementById('ExplorarSerie').innerHTML = str;
      })
      .catch(error => {
        console.error('Erro:', error);
        document.getElementById('ExplorarSerie').innerHTML = '<p>Ocorreu um erro ao buscar as séries.</p>';
      });
  }
}


function favoritar() {
  const URLPage = new URLSearchParams(window.location.search);
  const ID = URLPage.get("id");

  fetch(ApiProfile)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados de usuários");
      }
      return response.json();
    })
    .then(data => {
      const profileid = data[0].id; // Supondo que o primeiro perfil seja o desejado
      fetch(ApiFavoritos)
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro ao buscar dados de Favoritos");
          }
          return response.json();
        })
        .then(db_fav => {
          // Verifica se a série já existe nos favoritos
          const serieJaExiste = db_fav.some(favorito => favorito.idtmdb === ID && favorito.idprofile === profileid);

          if (serieJaExiste) {
            console.log("A série já está nos favoritos.");
            return; // Não faz nada se já existir
          }

          // Se não existe, adiciona como novo favorito
          let ultmoid = 0; 
          for (let i = 0; i < db_fav.length; i++) {
            if (db_fav[i].id >= ultmoid) {
              ultmoid = db_fav[i].id;
            }
          }

          const novoFavorito = {
            id: ultmoid + 1, // Incrementa o ID para garantir que é único
            idprofile: profileid,
            idtmdb: ID
          };

          fetch(ApiFavoritos, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoFavorito),
          })
          .then(() => {
            console.log("Série adicionada aos favoritos com sucesso.");
            window.location.reload(true);
          })
          .catch(err => {
            console.error("Erro ao adicionar aos favoritos:", err);
          });
        });
    })
    .catch(err => {
      console.error("Erro:", err);
    });
}

function CarregaProfile() {

  fetch(ApiProfile)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados de usuários");
      }
      return response.json();
    })
    .then(data => {
      console.log(data);

      const usuario = data[0];



      let str = '';
      str += `
            <h1>Informação do Aluno</h1>
            <hr>
            <div class="col-md-8">
                        <div class="card mb-8">
                            <div class="card-body">
                                <h5 class="card-title fs-3">Sobre</h5>
                                <p class="card-text text-break">${usuario.sobre}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <div class="card-body">
                                <h5 class="card-title fs-3">Autoria</h5>
                                <div class="container p-2">
                                    <div class="row">
                                        <div class="col-md-2 p-2">
                                            <div class="box">
                                                <img id="iconPerson" src="${usuario.img_profile}" >
                                            </div>
                                        </div>
                                        <div class="col-md-10">
                                            <div class="box">
                                                <h6 class="card-text mx-5 ms-auto text-break">Aluno: 
                                                    <span >${usuario.aluno}</span>
                                                </h6>
                                                <h6 class="card-text mx-5 ms-auto text-break">Curso: 
                                                    <span>${usuario.curso}</span>
                                                </h6>
                                                <h6 class="card-text mx-5 ms-auto text-break">Turma: 
                                                    <span>${usuario.turma}</span>
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    <h2 class="card-title fs-4">Redes Sociais:
                                    <a class="p-1" href="${usuario.face}"><i class="bi bi-facebook"></i></a>
                                    <a class="p-1" href="${usuario.linkedin}"><i class="bi bi-linkedin"></i></a>
                                    <a class="p-1" href="${usuario.insta}"><i class="bi bi-instagram"></i></a>
                                    </h2>
                                </div>
                            </div>
                        </div>
                    `;

      document.getElementById('Usuario').innerHTML = str;
    })
    .catch(error => {
      console.error('Erro ao carregar usuários:', error);
    })
}
function SeriesFav() {
  let str = '';
  fetch(ApiFavoritos)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados de Favoritos");
      }
      return response.json();
    })
    .then(data => {
      db_fav = data;
      for (let j = 0; j < data.length; j++) {
        let fav = data[j];



        const url = 'https://api.themoviedb.org/3/tv/' + fav.idtmdb + '?language=pt-BR';
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTU5NzJiOGI0ZDcxYWJmMzExNzhjNzQyY2NjMTVhNyIsIm5iZiI6MTczMjY0Mjg3MC44MzY3NjYsInN1YiI6IjY3NDRjNDcyY2MxZDY5OTg2YmQ5ZTQzZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Z64R9ENKu-FoqfQRclGsKQtFQsdNiYB2cI1GmbdvGag'

          }
        };
        fetch(url, options)
          .then(res => res.json())
          .then(data => {
      
            str += `
                    <a href="serie.html?id=${data.id}" class="col-md-2 linkcard"><div>
                        <div class="card mb-4">
                        <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${data.original_name}</h5>
                                <p class="card-text">Popularidade ${calcularPorcentagem(data.popularity)}%<br>${data.first_air_date}</p>
                            </div>
                        </div>
                    </div></a>
                        `;
            document.getElementById('SeriesFav').innerHTML = str;
          })
      }
    })
}

function carrousel() {
  const url = 'https://api.themoviedb.org/3/trending/tv/week?language=pt-BR';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTU5NzJiOGI0ZDcxYWJmMzExNzhjNzQyY2NjMTVhNyIsIm5iZiI6MTczMjU1OTk4Ni4zODgsInN1YiI6IjY3NDRjNDcyY2MxZDY5OTg2YmQ5ZTQzZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l57FAXOTJGdXJNZRgTbRN3-j9XSA44F4aUjAQ3Tnk_8'
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(data => {
      let str = `<div id="carouselExampleCaptions" class="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="5" aria-label="Slide 6"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="6" aria-label="Slide 7"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="7" aria-label="Slide 8"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="8" aria-label="Slide 9"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="9" aria-label="Slide 10"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="10" aria-label="Slide 11"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="11" aria-label="Slide 12"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="12" aria-label="Slide 13"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="13" aria-label="Slide 14"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="14" aria-label="Slide 15"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="15" aria-label="Slide 16"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="16" aria-label="Slide 17"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="17" aria-label="Slide 18"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="18" aria-label="Slide 19"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="19" aria-label="Slide 20"></button>
                 
                    </div>
                    <div class="carousel-inner">
                      <div class="carousel-item active">
              `

      for (let j = 0; j < data.results.length; j++) {
        if (j != 0) {
          str += `<div class="carousel-item">`;
        }
        let serie = data.results[j]
        if (serie && serie.backdrop_path) {
          str += `
                     <img src="https://image.tmdb.org/t/p/original/${serie.backdrop_path}" class="d-block w-100" alt="...">
                        <div class=" bgzin carousel-caption d-none d-md-block">
                          <h5>${serie.name}</h5>
                        
                        </div>
                      </div>`
        } else {
          str += `<img src="./assets/img/SerieExemplo.png" class="d-block w-100" alt="...">
                        <div class=" bgzin carousel-caption d-none d-md-block">
                          <h5>${serie.name}</h5>
                         
                        </div>
                      </div>`
        }
      }
      str += `</div>
               <button class="carousel-control-prev bg-secondary bg-opacity-50" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next bg-secondary bg-opacity-50" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                  </div>
                  `


      console.log(data.results.length);
      console.log(str);
      document.getElementById('carro').innerHTML = str
    })
    .catch(err => console.error(err));
}
function calcularPorcentagem(popularidade) {
  let porcentagem = ((popularidade - 0) / (3300 - 0)) * 100;
  porcentagem = parseInt(porcentagem);
  return porcentagem;
}
