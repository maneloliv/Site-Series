// Abordagem FETCH
const ApiKey = 'aa5972b8b4d71abf31178c742ccc15a7';
const ApiFavoritos = '/favoritos'
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
                   <img src="./assets/img/SerieExemplo.png" id="img_card_detalhe" class="card-img-top" alt="...">n
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
  const url = 'https://api.themoviedb.org/3/discover/tv?api_key=${ApiKey}&language=pt-BR&';
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
      for (data.page = 1; data.page<9328; data.page++){
        
        for (let i = 0; i < data.results.length; i++) {
        const serie = data.results[i];
        if (serie.id == ID){
          let str = `
          <img src="https://image.tmdb.org/t/p/w500${serie.backdrop_path}" class="img-fluid w-100" alt="Imagem da Série">
          <div class="overlay position-absolute top-0 start-0 w-100 h-100">
            <div class="text-overlay text-white p-4">
              <h1 class="display-4">${serie.name}</h1>
              <p class="lead fs-6">${serie.overview}</p>
              <div class="container-fluid text-end">
                <button type="button" onclick="favoritar()" id="likeButton" class="like-btn"><i class="bi bi-heart"></i></button>
              </div>
            </div>
          </div>`;

        document.getElementById('ExibeDetalhes').innerHTML = str;
        break;
        
        }
       
      
      }
    }
  }
)
favoritar(ID);
}

function favoritar(id) {

  let fav = { "id": id};
  fetch(ApiFavoritos, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fav),
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
