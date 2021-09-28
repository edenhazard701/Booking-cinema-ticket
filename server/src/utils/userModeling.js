const Reservation = require('../models/reservation');
const Movie = require('../models/movie');

// Cinema User modeling (GET ALL CINEMAS)
// Get all cinemas based on the user's past reservations
// @return a sorted cinema list
const cinemaUserModeling = async (cinemas,username) => {
    const userReservations = await Reservation.find({username:username});

    if(userReservations.length){
        let cinemaResult ={};
        userReservations.map(userReservation=>{
            const id = userReservation.cinemaId;
            cinemaResult.hasOwnProperty(id)? ++cinemaResult[id] : cinemaResult[id] = 1
        });
        const sortedCinemaResult = [];
        for (let cinema in cinemaResult) {
            sortedCinemaResult.push([cinema, cinemaResult[cinema]]);
        }
       
        sortedCinemaResult.sort((a, b)=> {
            return b[1] - a[1];
        });
        console.log(sortedCinemaResult)

        const newCinemas = JSON.parse(JSON.stringify(cinemas));
        let i=0;
        let extractedObj;
        for(let sortedCinema of sortedCinemaResult){
            newCinemas.forEach((cinema,index) => {
                if(cinema._id == sortedCinema[0]){
                    console.log("FOUND")
                    extractedObj = newCinemas.splice(index,1);
                }
            });
            newCinemas.splice(i,0,extractedObj[0]);
            i++;
        }

        console.log(newCinemas)

        return newCinemas;
    } else{
        return cinemas;
    }
}

const moviesUserModeling = async (username) => {
    userPreference = {
        genre:{},
        director:{},
        cast:{}
    };

    const userReservations = JSON.parse(JSON.stringify(await Reservation.find({username:username})));
    const Allmovies = JSON.parse(JSON.stringify(await Movie.find({})));
    // const resultsMoviesWatched = userReservations.map( async reservation=>{
    //     let movie = await Movie.find({"_id":reservation.movieId});
    //     if(movie.length){
    //         return movie[0];
    //     }
    // });
    const moviesWatched = userReservations.map( reservation=>{
        for(let movie of Allmovies){
            if (movie._id == reservation.movieId){
                return movie;
            }
        }
    });

    //  console.log(moviesWatched);

    moviesWatched.map(movie=>{
        //console.log(movie)
        let genre = movie.genre;
        let director = movie.director;
        let casts = movie.cast.replace(/\s*,\s*/g, ",").split(',');
        userPreference.genre[genre]? ++userPreference.genre[genre] : userPreference.genre[genre] =1;
        userPreference.director[director]? ++userPreference.director[director] : userPreference.director[director] =1;
        for(let cast of casts){
            userPreference.cast[cast]? ++userPreference.cast[cast] : userPreference.cast[cast] =1; 
        }
    });

    //find movies that are available for booking
    availableMovies = availableMoviesFilter(Allmovies);
    moviesNotWatched = moviesNotWatched(availableMovies,userReservations);
    console.log(moviesNotWatched.length)

}


const availableMoviesFilter = (Allmovies)=>{
    const today = new Date();
    // console.log(Allmovies.length)
    // console.log(today);
    return Allmovies.map(movie=>{
        let releaseDate = new Date(movie.releaseDate);
        let endDate = new Date(movie.endDate);
       if(today >= releaseDate && today <= endDate){
           return movie;
       }
    })
};

const moviesNotWatched = (availableMovies,userReservations)=>{

    return availableMovies.map(movie=>{
        let isFirst = [];
        for(let reservation of userReservations){
            if(reservation.movieId == movie._id){
                isFirst.push(false);
            }else {
                isFirst.push(true);
            }
        }
        console.log(isFirst.every(Boolean))

        if(isFirst.every(Boolean)){
            return movie;
        }
    });
};


const userModeling = {
    cinemaUserModeling,
    moviesUserModeling
}

module.exports = userModeling;