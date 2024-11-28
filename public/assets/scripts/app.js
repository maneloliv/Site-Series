// Abordagem FETCH
const ApiKey = 'aa5972b8b4d71abf31178c742ccc15a7';
const ApiFavoritos = '/favoritos'
const ApiProfile = '/profile'

var db_fav= [];
 

function ExibeSerie(){
    fetch (`https://api.themoviedb.org/3/discover/tv?api_key=${ApiKey}&language=pt-BR&`)
    .then(res => res.json ())
    .then(data => {
            let str = ''
            for (let i = 0; i < 12; i++) {
                let serie = data.results[i]
                str += `<a href="serie.html?id=${serie.id}" target="_blank" class="col-2 my-2">
                        <div class="card">
                            <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="...">
                    </div></a>`
            }
            console.log(data.results.length)
            document.getElementById('NovasSeries').innerHTML = str
    })
}
function ExplorarSerie(){
    fetch (`https://api.themoviedb.org/3/discover/tv?api_key=${ApiKey}&language=pt-BR&`)
    .then(res => res.json ())
    .then(data => {
            let str = ''
            for (let i = 0; i < 12; i++) {
                let serie = data.results[i]
                str += `<a href="serie.html?id=${serie.id}" class="col-md-2"><div>
                        <div class="card mb-4">
                        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${serie.original_name}</h5>
                                <p class="card-text">Popularidade ${serie.popularity}<br>${serie.first_air_date}</p>
                            </div>
                        </div>
                    </div></a>`
            }
            console.log(data.results.length)
            document.getElementById('ExplorarSerie').innerHTML = str
    })
}

function ExibeElenco(){
  const URLPage = new URLSearchParams(window.location.search);
  const ID = URLPage.get("id");
  const url = 'https://api.themoviedb.org/3/tv/'+ID+'/credits?language=en-US';
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
            let str= `<div class="carousel-item active">
            <div class="row">
              `
              
            for (let j = 0; j<data.cast.length; j++){
              if ( j % 4 == 0 && j !== 0) {          
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
                }else{
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
}
function ExibeDetalhes() {
  const URLPage = new URLSearchParams(window.location.search);
  const ID = URLPage.get("id");
  const url = 'https://api.themoviedb.org/3/tv/'+ID+'?language=en-US';
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
        if(data.backdrop_path != null){
          let str = `
          <img src="https://image.tmdb.org/t/p/w500${data.backdrop_path}" class="img-fluid w-100" alt="Imagem da Série">
          <div class="overlay position-absolute top-0 start-0 w-100 h-100">
            <div class="text-overlay text-white p-4">
              <h1 class="display-4">${data.name}</h1>
              <p class="lead fs-6">${data.overview}</p>
              <div class="container-fluid text-end">
                <button type="button" onclick="favoritar();SeriesFav()" id="likeButton" class="like-btn"><i class="bi bi-heart"></i></button>
              </div>
            </div>
          </div>`;

        document.getElementById('ExibeDetalhes').innerHTML = str;
        }else{
          let str = `
          <img src="./assets/img/SerieExemplo.png" class="img-fluid w-100" alt="Imagem da Série">
          <div class="overlay position-absolute top-0 start-0 w-100 h-100">
            <div class="text-overlay text-white p-4">
              <h1 class="display-4">${data.name}</h1>
              <p class="lead fs-6">${data.overview}</p>
              <div class="container-fluid text-end">
                <button type="button" onclick="favoritar();SeriesFav()" id="likeButton" class="like-btn"><i class="bi bi-heart"></i></button>
              </div>
            </div>
          </div>`;

        document.getElementById('ExibeDetalhes').innerHTML = str;
        }
          
    })
}



function BuscaSerie(event) {
    event.preventDefault();
    var nomeDaSerie = document.getElementById('inputBuscar').value;
    if (nomeDaSerie == ''){
        return ExplorarSerie();
    }else{
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
            str += `<a href="serie.html?id=${serie.id}" class="col-md-2"><div>
                        <div class="card mb-4">
                        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text">Popularidade ${serie.popularity}<br>${serie.first_air_date}</p>
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
        let profileid = data[0].id;
        fetch(ApiFavoritos)
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro ao buscar dados de Favoritos");
          }
          return response.json();
        })
        .then(db_fav => {
          let ultmoid = 0; 
          for(let i;  i<db_fav.length; i++){
            if(db_fav.id>= ultmoid){
              ultmoid = db_fav.id;
            }
          }
          let fav = {"id": ultmoid, "idprofile": profileid, "idtmdb": ID};
          fetch(ApiFavoritos, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(fav),
          });
        })
    })
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
            str +=`
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
function SeriesFav(){
  let str = '';
  fetch(ApiFavoritos)
  .then(response => {
    if (!response.ok) {
      throw new Error("Erro ao buscar dados de Favoritos");
    }
    return response.json();
  })
  .then(db_fav => {
    
    for (let j = 0; j < db_fav.length; j++) {
     let fav = db_fav[j];
    
      console.log(fav.idtmdb);


      const url = 'https://api.themoviedb.org/3/tv/'+fav.idtmdb+'?language=en-US';
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
            console.log(str);
                  str += `
                    <a href="serie.html?id=${data.idtmdb}" target="_blank" class="col-2 my-2">
                            <div class="card">
                                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="...">
                        </div></a>
                        `;
                        document.getElementById('SeriesFav').innerHTML = str; 
            })    
    } 
  })
}

