import axios from 'axios';
import Vue from 'vue';
import { HorizontalBar } from 'vue-chartjs';
import '../css/app.css';

let api_base_url = process.env.VUE_APP_API_BASE_URL;

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
          id: 0,
          name: 'Thin Mints',
          color: '#00AE58',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_Thinmint.png',
        },
        {
          i: 1,
          name: 'Samoas',
          color: '#6E298C',
          image: 'https://cdn.digitalcookie.girlscouts.org/images/product/thumbnail/sam_th.png',
        },
        {
          id: 2,
          name: 'Tagalongs',
          color: '#EE3123',
          image: 'https://cdn.digitalcookie.girlscouts.org/images/product/thumbnail/tag_th.png',
        },
        {
          id: 3,
          name: 'Adventurefuls',
          color: '#D5CAA0',
          image: 'https://cdn.digitalcookie.girlscouts.org/images/product/thumbnail/21_GSMM_AdventurefulsList_180x104px.png',
        },
        {
          id: 4,
          name: 'Do-Si-Dos',
          color: '#EB9C3F',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_Dosido.png',
        },
        {
          id: 5,
          name: 'Trefoils',
          color: '#3170AB',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_Trefoil.png',
        },
        {
          id: 6,
          name: 'Lemon-Ups',
          color: '#F1D748',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_LemonUp.png',
        },
        {
          id: 7,
          name: 'Girl Scout S\'mores',
          color: '#874D33',
          image: 'https://content.digitalcookie.girlscouts.org/images/cloud/product/thumbnails/LBBCookieProductOrderCardThumbnail_Smores.png',
        },
        {
          id: 8,
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
              stepSize: 1,
            },
            min: 0,
          },
          yAxes: [{
            ticks: {
                fontColor: "white",
                fontSize: 20,
                stepSize: 1,
                beginAtZero: true
            }
        }]
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
      getCountsFromServerVotes(server_votes) {
        let counts = [0,0,0,0,0,0,0,0,0];
        let votes = [];
        server_votes.forEach((v) => {
          if(!v.picks || !v.picks.length) {
            return;
          } else {
            votes.push(v.picks);
            counts[v.picks[0]]++;
          }
        });
        this.votes = votes;
        console.log(counts);
        return counts;
      },
      getCountsFromVotes(votes) {
        if(!votes) {
          votes = this.votes;
        }
        let counts = [0,0,0,0,0,0,0,0,0];
        votes.forEach((v) => {
          counts[v[0]]++;
        });
        return counts;
      },
      resetVoteForm() {
        let ty = document.getElementById('thank-you');
        ty.className = '';
      },
      async refreshVoteCounts(update) {
        try {
          let votes = await axios.get(api_base_url + '/api/votes'); //
          this.voteCounts = this.getCountsFromServerVotes(votes.data.data);
          this.updateVotesChart();
        } catch(e) {
          console.log('Getting votes failed.');
          throw(e);
          let votes = [];
        }
      },
      updateVotesChart() {
        if(!this.voteCounts || !this.cookies) {
          return;
        }
        // set the vote_count for each of the cookies
        this.voteCounts.forEach((vote_count, id) => {
          console.log({vote_count, id,cookie: this.cookies[id]});
          this.cookies[id].vote_count = vote_count;
        });

        //sort the cookies by vote_count
        let sorted_cookies = [...this.cookies].sort((a, b) => Math.max(-1,Math.min(1,b.vote_count - a.vote_count)));

        // set the labels, colors, and values
        this.data.labels = sorted_cookies.map(c => c.name);
        this.data.datasets[0].backgroundColor = sorted_cookies.map((c) => c.color);
        this.data.datasets[0].data = sorted_cookies.map(c => c.vote_count);

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
      async castVote() {
        this.votes.push(this.picks);
        let votes = await axios.post(api_base_url + '/api/votes', {picks:this.picks}); //
        this.voteCounts = this.getCountsFromVotes();
        this.picks = [];
        this.updateVotesChart();
        let ty = document.getElementById('thank-you');
        
        // show thank you
        ty.className = 'open';
        // hide thank you after 3 seconds
        //setTimeout(function() { ty.className = '';}, 3000);
      },
    },
    computed: {
      allow_reset: function() {
        return document.location.hash == '#reset';
      },
      show_results: function() {
        return document.location.hash == '#results';
      }
    }
  })