<template>
  <div :class="`alert alert-${type} alert-dismissible fade show`" role="alert">
    {{ message }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</template>
  
  
<script>
export default {
  props: {
    message: { required: true, type: String },
    type: { required: true, type: String },
  },
};
</script>

  