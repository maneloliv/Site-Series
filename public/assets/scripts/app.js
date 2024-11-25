// Abordagem FETCH
const ApiKey = 'aa5972b8b4d71abf31178c742ccc15a7';




function ExibeSerie(){
    fetch (`https://api.themoviedb.org/3/discover/tv?api_key=${ApiKey}&language=pt-BR&`)
    .then(res => res.json ())
    .then(data => {
            let str = ''
            for (let i = 0; i < 12; i++) {
                let serie = data.results[i]
                str += `<a href="https://www.themoviedb.org/movie/${serie.id}" target="_blank" class="col-2 my-2">
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
                str += `<a href="https://www.themoviedb.org/movie/${serie.id}" class="col-md-2"><div>
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
            str += `<a href="https://www.themoviedb.org/movie/${serie.id}" class="col-md-2"><div>
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
