import axios from 'axios';
import Vue from 'vue';
import { HorizontalBar } from 'vue-chartjs';
import '../css/app.css';

Vue.component('cookie-chart', {
    extends: HorizontalBar,
    props: ['data', 'options'],
    mounted () {
      console.log('cookie chart mounted')
      this.updateChart();
    },
    methods: {
      updateChart() {
        console.log('updateChart');
        if(this._chart) {
          this._chart.destroy();
        }
        this.renderChart(this.data, this.options);
      }
    },
    watch: {
      data: function() {
        this.updateChart();
      }
    }
  })
  
  var vm = new Vue({
    el: '.app',
    data: {
      picks: [],
      voteCounts: [0,0,0,0,0,0,0,0,0],
      votes: [],
      cookies: [
        {
          name: 'Thin Mints',
          color: '#00AE58',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_Thinmint.png',
        },
        {
          name: 'Samoas',
          color: '#6E298C',
          image: 'https://cdn.digitalcookie.girlscouts.org/images/product/thumbnail/sam_th.png',
        },
        {
          name: 'Tagalongs',
          color: '#EE3123',
          image: 'https://cdn.digitalcookie.girlscouts.org/images/product/thumbnail/tag_th.png',
        },
        {
          name: 'Adventurefuls',
          color: '#D5CAA0',
          image: 'https://cdn.digitalcookie.girlscouts.org/images/product/thumbnail/21_GSMM_AdventurefulsList_180x104px.png',
        },
        {
          name: 'Do-Si-Dos',
          color: '#EB9C3F',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_Dosido.png',
        },
        {
          name: 'Trefoils',
          color: '#3170AB',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_Trefoil.png',
        },
        {
          name: 'Lemon-Ups',
          color: '#F1D748',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_LemonUp.png',
        },
        {
          name: 'Girl Scout S\'mores',
          color: '#874D33',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_Smores.png',
        },
        {
          name: 'Toffee-Tastic',
          color: '#50B0B8',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_Toffee.png',
        },
      ],
      data: {
          labels: [],
          datasets: [{
              label: "Votes",
                    borderWidth: 1,
              fill: true,
              data: [],
              labelColor: '#fff',
              backgroundColor: [],
          }]
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          x: {
            ticks: {
              color: '#fff',
            }
          }
        }
      }
    },
    computed: {},
    beforeMount() {
      this.data.labels = this.cookies.map((c) => c.name);
      this.data.datasets[0].backgroundColor = this.cookies.map((c) => c.color);
    },
    mounted() {
      this.refreshVoteCounts();
      this.updateVotesChart();
    },
    methods: {
      getCountsFromVotes() {
        let counts = [0,0,0,0,0,0,0,0,0];
        this.votes.forEach((v) => {
          counts[v[0]]++;
        });
        return counts;
      },
      async refreshVoteCounts(update) {
        try {
        let votes = await axios.get('https://vote.cookieorder.org/api/votes'); //
        } catch(e) {
          console.log('Getting votes failed.');
          let votes = [];
        }
      },
      updateVotesChart() {
        this.data.datasets[0].data = this.voteCounts;
        this.$refs.chart.updateChart();
      },
      pickCookie(i) {
        let index = this.picks.indexOf(i);
        // if this cookie has already been picked, remove it
        if(index != -1) {
          this.picks.splice(index,1);
        } else {
          // add cookie as next choice
          this.picks.push(i);
        }
      },
      castVote() {
        this.votes.push(this.picks);
        this.voteCounts = this.getCountsFromVotes();
        this.picks = [];
        this.updateVotesChart();
        let ty = document.getElementById('thank-you');
        
        // show thank you
        ty.className = 'open';
        // hide thank you after 3 seconds
        setTimeout(function() { ty.className = '';}, 3000);
      },
    },
  })