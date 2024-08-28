<template>
  <!-- <div class="container mt-5">
    
    <div v-if="this.filteredResults.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quiz Pin</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in filteredResults" :key="index">
            <td>{{ result.name }}</td>
            <td>{{ result.quizPin }}</td>
            <td>{{ result.result }}</td>
          </tr>
        </tbody>
      </table>
    </div>
   
  </div> -->
  <div class="container mt-5">
    <h1>Quiz Results</h1>
    <p>Quiz Pin: {{ quizPin }}</p>
    <!-- Top Three Participants -->
    <div class="row justify-content-center mt-5">
      <div v-for="(res, index) in topThree" :key="index" class="col-md-2">
        <div class="card text-center" style="align-items:center;">
          <img :src="imagePath(res.avatarId)" :alt="'Participant ' + res.avatarId" class="card-img-top"
            style="width:100px;">
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
                    <th></th>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(res, index) in restOfParticipants" :key="index">
                    <td style="vertical-align: middle;">{{ index + 6 }}</td>
                    <td style="vertical-align: middle;">
                      <img :src="imagePath(res.avatarId)" :alt="'Participant ' + res.avatarId" style="width:50px;">
                    </td>
                    <td style="vertical-align: middle;">
                    {{ res.name }}</td>
                    <td style="vertical-align: middle;">{{ res.result }}</td>
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
import avatar1 from "@/assets/1.jpg";
import avatar2 from "@/assets/2.jpg";
import avatar3 from "@/assets/3.jpg";
import avatar4 from "@/assets/4.jpg";
import avatar5 from "@/assets/5.jpg";
import avatar6 from "@/assets/6.jpg";
import avatar7 from "@/assets/7.jpg";
import avatar8 from "@/assets/8.jpg";
import avatar9 from "@/assets/9.jpg";
import avatar10 from "@/assets/10.jpg";
import avatar11 from "@/assets/11.jpg";
import avatar12 from "@/assets/12.jpg";
import avatar13 from "@/assets/13.jpg";
import avatar14 from "@/assets/14.jpg";
import avatar15 from "@/assets/15.jpg";
import avatar16 from "@/assets/16.jpg";
import avatar17 from "@/assets/17.jpg";
import avatar18 from "@/assets/18.jpg";

export default {
  props: {
    quizPin: String
  },
  data() {
    return {
      topThree: [], // Store top five participants
      restOfParticipants: [], // Store the remaining participants
      avatars: [
        { id: 1, filename: avatar1 },
        { id: 2, filename: avatar2 },
        { id: 3, filename: avatar3 },
        { id: 4, filename: avatar4 },
        { id: 5, filename: avatar5 },
        { id: 6, filename: avatar6 },
        { id: 7, filename: avatar7 },
        { id: 8, filename: avatar8 },
        { id: 9, filename: avatar9 },
        { id: 10, filename: avatar10 },
        { id: 11, filename: avatar11 },
        { id: 12, filename: avatar12 },
        { id: 13, filename: avatar13 },
        { id: 14, filename: avatar14 },
        { id: 15, filename: avatar15 },
        { id: 16, filename: avatar16 },
        { id: 17, filename: avatar17 },
        { id: 18, filename: avatar18 }
      ],
    };
  },
  async created() {
    try {
      const response = await api.getQuizResults(this.quizPin);
      const results = response.data;
      this.topThree = results.slice(0, 3);
      this.restOfParticipants = results.slice(3);

    } catch (error) {
      console.error("Error filtering results:", error);
    }
  },
  methods: {
    imagePath(fileName) {
      console.log(fileName);
      if (fileName == 1)
        return avatar1;
      else if (fileName == 2)
        return avatar2;
      else if (fileName == 3)
        return avatar3;
      else if (fileName == 4)
        return avatar4;
      else if (fileName == 5)
        return avatar5;
      else if (fileName == 6)
        return avatar6;
      else if (fileName == 7)
        return avatar7;
      else if (fileName == 8)
        return avatar8;
      else if (fileName == 9)
        return avatar9;
      else if (fileName == 10)
        return avatar10;
      else if (fileName == 11)
        return avatar11;
        else if (fileName == 12)
        return avatar12;
      else if (fileName == 13)
        return avatar13;
      else if (fileName == 14)
        return avatar14;
      else if (fileName == 15)
        return avatar15;
      else if (fileName == 16)
        return avatar16;
        else if (fileName == 17)
        return avatar17;
      else if (fileName == 18)
        return avatar18;
    },
    getPlace(index) {
      if (index === 0) return '1st';
      if (index === 1) return '2nd';
      if (index === 2) return '3rd';
      // if (index === 3) return '4th';
      // if (index === 4) return '5th';
      return '';
    }
  },
};
</script>