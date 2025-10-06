<template>
  <div class="container mt-5">
    <h1>Quiz Results</h1>
    <p>Quiz Pin: {{ quizPin }}</p>
    <!-- Top Three Participants -->
    <div class="row justify-content-center mt-5">
      <div v-for="(res, index) in topThree" :key="index" class="col-md-2">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">{{ getPlace(index) }} Place</h5>
            <p class="card-text">{{ res.name }}</p>
            <h4 class="card-text">{{ res.result }}</h4>
          </div>
        </div>
      </div>
      <div v-if="restOfParticipants.length > 0">
        <div class="container mt-5">
          <!-- Rest of the Participants -->
          <div class="row mt-5">
            <div class="col-md-12">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(res, index) in restOfParticipants" :key="index">
                    <td>{{ index + 4 }}</td>
                    <td>{{ res.name }}</td>
                    <td>{{ res.result }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  props: {
    quizPin: String
  },
  data() {
    return {
      topThree: [], // Store top three participants
      restOfParticipants: [], // Store the remaining participants
    };
  },
  async created() {
    try {
      const response = await api.getQuizResults(this.quizPin);
      console.log("API Response:", response.data);

      // Access the `results` property from the response
      let results = response.data.results;

      // Ensure results is an array
      if (!Array.isArray(results)) {
        console.warn("API response is not an array. Converting to array.");
        results = [];
      }

      // Validate each item in the array
      results = results.map(item => {
        return {
          name: item.name || "Unknown",
          quizPin: item.quizPin || "N/A",
          result: item.result || 0,
        };
      });

      // Handle empty results
      if (results.length === 0) {
        console.warn("No results found.");
        this.topThree = [];
        this.restOfParticipants = [];
      } else {
        this.topThree = results.slice(0, 3);
        this.restOfParticipants = results.slice(3);
      }
    } catch (error) {
      console.error("Error filtering results:", error);
    }
  },
  methods: {
    getPlace(index) {
      if (index === 0) return '1st';
      if (index === 1) return '2nd';
      if (index === 2) return '3rd';
      return '';
    }
  }
};
</script>