"use strict";
class DataPoint{
    constructor(x,y){
        this.x = x
        this.y = y
    }

    set_x(x){
        this.x = x
    }
    
    get get_x(){
      return this.x
    }

    set_y(y){
        this.y = y
    }
    
    get get_y(){
      return this.y
    }
        
    set_cluster(clusterNumber){
      this.clusterNumber = clusterNumber;
    }

    get get_cluster(){
      return this.clusterNumber
    }
}

class Centroid {
    constructor(x, y){
        this.x = x
        this.y = y
    }
    
    set_x(x){
        this.x = x
    }
    
    get get_x(){
      return this.x
    }

    set_y(y){
        this.y = y
    }
    
    get get_y(){
      return this.y
    }
}


class kmeans{
    constructor(num_cluster, samples){
        this.num_cluster = num_cluster;
        this.samples = samples
        this.total_data = samples.length;
        this.data = [];
        this.centroids = [];
        this.isStillMoving = 1;

        this.initialize_centroids()
        this.initialize_datapoints()
    }

    initialize_centroids(){
        // Set the centoid coordinates to match the data points furthest from each other.
        // In this example, (1.0, 1.0) and (5.0, 7.0)
        for (var i = 0; i < this.num_cluster; i++) {
            var pos = Math.floor(Math.random()*this.total_data)
            var c = new Centroid(this.samples[pos][0], this.samples[pos][1])
            this.centroids.push(c)
        }
    }

    initialize_datapoints(){
        // DataPoint objects' x and y values are taken from the SAMPLE array.
        // The DataPoints associated with LOWEST_SAMPLE_POINT and HIGHEST_SAMPLE_POINT are initially
        // assigned to the clusters matching the LOWEST_SAMPLE_POINT and HIGHEST_SAMPLE_POINT centroids.

        for (var i = 0; i < this.total_data; i++) {
          var newPoint = new DataPoint(this.samples[i][0], this.samples[i][1])

          if (i <= this.num_cluster) {
            newPoint.set_cluster(i)
          } else{
            newPoint.set_cluster(NaN)
          };

          this.data.push(newPoint)
        };
    }

    get_distance(dx, dy, cx, cy){
        // Calculate Euclidean distance.
        return Math.sqrt(Math.pow((cy - dy), 2) + Math.pow((cx - dx), 2))
    }

    recalculate_centroids(){
        this.isStillMoving = 0;

        for (var j = 0; j < this.num_cluster; j++) {
          var totalX = 0, 
            totalY = 0,
            totalInCluster = 0,
            current_position = [this.centroids[j].x, this.centroids[j].y]; 

          for (var k = 0; k < this.data.length; k++) {
            if (this.data[k].get_cluster == j) {
              totalX += this.data[k].get_x
              totalY += this.data[k].get_y
              totalInCluster += 1
            };
          }

          if(totalInCluster > 0){
              this.centroids[j].set_x(totalX / totalInCluster)
              this.centroids[j].set_y(totalY / totalInCluster)
          }


          if(this.centroids[j].x != current_position[0]  || this.centroids[j].y != current_position[1]){
            this.isStillMoving = 1;
          }

        }
    }

    update_clusters(){
        for (var i = 0; i < this.total_data; i++) {
          var bestMinimum = 1000000,
            currentCluster = 0

            for (var j = 0; j < this.num_cluster; j++) {
              var distance = this.get_distance(this.data[i].get_x, this.data[i].get_y, this.centroids[j].get_x, this.centroids[j].get_y)

              if (distance < bestMinimum) { 
                bestMinimum = distance;
                currentCluster = j;
              };
            }

            this.data[i].set_cluster(currentCluster);
            
        };
    }

    fit(max_count){
        var max_count = max_count || 100;
        var count = 0;
        while(this.isStillMoving == 1 && count < max_count){
            this.recalculate_centroids()
            this.update_clusters()
            count +=1;
        }
    }

    log(){
        for (var i = 0; i < this.num_cluster; i++) {
            console.log("Cluster ", i, " includes:")
            for (var j = 0; j < this.total_data; j++) {
                if(this.data[j].get_cluster == i){
                    console.log("(", this.data[j].get_x, ", ", this.data[j].get_y, ")")
                }
            console.log()
          }
        }
    }

}