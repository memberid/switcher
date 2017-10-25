new Vue({
  delimiters: ['${', '}'],
  el: "#app",
  components: {
    'v-select': window.VueSelect.VueSelect
  },
  data: {
    repo: "memberid.api",
    branch: "",

    building: false,
    buildData: {}
  },
  mounted: function() {
  },
  methods: {
    build: function() {
      if (this.building) {
        alert('Masih building yaks >.<')
        return false
      }
      var buildInterval
      this.building = true
      var self = this
      axios.post('/build2', {
        repo: self.repo,
        branch: self.branch
      }).then(function(resp) {
        self.buildData = resp.data

        buildInterval = setInterval(function() {
          axios.get('/build/'+self.buildData.build_num, {
            params: {
              repo: self.repo,
              branch: self.branch
            }
          }).then(function(r) {
            console.log(r.data)
            if (r.data.lifecycle === 'finished') {
              clearInterval(buildInterval)
              self.building = false
            }
          })
        }, 5000)
      })
    }
  }
})
