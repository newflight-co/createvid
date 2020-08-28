<template>
    <div class="col-12 col-md-6 q-my-md-xl q-my-md">
        <h3 class="text-primary">{{title}}</h3>
    </div>
</template>

<script>

export default {
  name: 'Title',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus" scoped>
h3 {
    margin: 0;
}
</style>
