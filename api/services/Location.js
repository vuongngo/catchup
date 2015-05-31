module.exports = {
	
	getBoundaries:  function  (lat, lng) {
      return {
        lat1: parseFloat(lat) - 1/110.574,
        lng1: parseFloat(lng) - 1/111.320,
        lat2: parseFloat(lat) + 1/110.574,
        lng2: parseFloat(lng) + 1/111.320
      }
    },


}