document.getElementById('search-btn').addEventListener('click', () => {
  const zipcode = document.getElementById('zipcode').value;

  fetch(`http://zip.cgis.biz/xml/zip.php?zn=${zipcode}`)
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      const address = data.querySelector('state').textContent +
                      data.querySelector('city').textContent +
                      data.querySelector('address').textContent;

      document.getElementById('address').textContent = address;
      showMap(address);
    })
    .catch(error => console.error('エラー:', error));
});

function showMap(address) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': address }, (results, status) => {
    if (status === 'OK') {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: results[0].geometry.location
      });
      new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      alert('地図を表示できませんでした: ' + status);
    }
  });
}
