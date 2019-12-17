// eslint-disable-next-line import/prefer-default-export
export const markup = `<header>

    <div class="control-panel">

        <div class="button-change-background" id="button-change-background"></div>

        <form action="#" class="change-language">

            <select name="" id="change-language">

                <option class="en" value="en">en</option>
                <option class="ru" value="ru">ru</option>
                <option class="be" value="be">be</option>

            </select>

        </form>

        <div class="buttons-change-temperature-units">
            <div class="button-fahrenheit">&ordm; f</div>
            <div class="button-celsius">&ordm; c</div>
        </div>           
    </div>

    <form action="#" class="form-search">    
        <input type="search" id="data-search-city" placeholder="Search city or ZIP"/>
        <input type="submit" id="search-city" value="search"/>
        <div class="voice-search"></div>        

    </form>  

</header>

<div class="wrapper">

    <div class="weather">

        <div class="weather__today">

            <div class="info">        
                <h1></h1>                         
                <h3></h3>                
            </div>

            <div class="temperature-summary">                    

                <p class="temperature"></p>
                <img src="" alt="" class="icon-weather">

                <ul>
                    <li class="summary"></li>
                    <li class="feels-like"></li>
                    <li class="wind"></li>
                    <li class="humidity"></li>
                </ul>

            </div>

        </div>

        <div class="weather__three-days">

            <div class="weather__three-days__first">

                <p class="day-week day-week-first"></p>

                <div class="info-day">
                    <p class="day-temperature"></p>
                    <img src="" alt="" class="day-icon">
                </div>                        

            </div>

            <div class="weather__three-days__second">

                <p class="day-week day-week-second"></p>

                <div class="info-day">
                    <p class="day-temperature"></p>
                    <img src="" alt="" class="day-icon">
                </div>

            </div>

            <div class="weather__three-days__third">

                <p class="day-week day-week-third"></p>

                <div class="info-day">
                    <p class="day-temperature"></p>
                    <img src="" alt="" class="day-icon">
                </div>

            </div>

        </div>

    </div>

    <div class="geolocation">

        <div class="geolocation__map">

            <div class="map" id="map"></div>                

        </div>

        <div class="geolocation__coordinates">

            <p class="latitude"></p>
            <p class="longitude"></p>

        </div>

    </div>

</div>`;
