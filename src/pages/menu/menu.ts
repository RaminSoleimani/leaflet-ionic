  import { ModalController, AlertController } from 'ionic-angular';
  import { AuthService } from '../services/auth.service';
  import { FirebaseService } from '../services/firebase.service';
  import { NewTaskModalPage } from '../new-task-modal/new-task-modal';
  import { DetailsPage } from '../details/details';
  import { LoginPage } from '../login/login';
  import { Component, ViewChild, ElementRef } from '@angular/core';
  import { NavController } from 'ionic-angular';
  import  leaflet from 'leaflet';
  
  import 'leaflet-routing-machine';
  //import 'leaflet-easybutton';

  @Component({
    selector: 'page-menu',
    templateUrl: 'menu.html'
  })

  export class MenuPage {

      @ViewChild('map') mapContainer: ElementRef;
    map: any;
    items: Array<any>;
    path=[{
        lat: 41.4874027,
        lng: 2.1329372
        }];

    latlngs:Array<any>=[
      [41.4870168,2.1329678],
      [41.4880795,2.1324367],
      [41.4880795,2.1324367]
      ];


    
      counter:number=0;
    //



    constructor(public navCtrl: NavController,
                private authService: AuthService,
                private firebaseService: FirebaseService,
                private alertCtrl: AlertController,
                
              ) {

              }
              //ramin.soleimani@ymail.com
              //Shadi1992

    ionViewDidEnter() {
      this.cargar();
    }
      ionViewCanLeave(){
          document.getElementById('map').outerHTML="";
      }
    loadmap() {
      //this.map = leaflet.map("map").fitWorld();
      this.map = leaflet.map("map").setView([41.4822619,2.1341925], 13);
      leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attributions: 'www.tphangout.com',
        maxZoom: 20
      }).addTo(this.map);
      
      this.map.locate({
        setView: true,
        maxZoom: 15
      }).on('locationfound', (e) => {
        let markerGroup = leaflet.featureGroup();
        let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
          alert('I am Here!');
        })
        markerGroup.addLayer(marker);
        console.log("mar"+markerGroup);
        this.map.addLayer(markerGroup);
        this.map.setZoom(15);
        }).on('locationerror', (err) => {
          alert(err.message);
      })
       // var polyline = leaflet.polyline(this.latlngs, {color: 'red'}).addTo(this.map);
       // this.map.fitBounds(polyline.getBounds());
    
      this.map.on('click', (e)=>{this.onMapClick(e)});

      leaflet.Routing.control({
      waypoints: [
      leaflet.latLng(41.4822619,2.1341925),
      leaflet.latLng(41.4860676,2.1364992)
      ],
      routeWhileDragging: true
      }).addTo(this.map);
    }

    /////////




    onMapClick(e
      ) {


      // console.log(e.latlng.lng, e.latlng.lat);
      let markerGroup = leaflet.featureGroup();
      var myIcon = leaflet.icon({
      iconUrl: '../../assets/imgs/step.png',
      iconSize: [20, 54],
      iconAnchor: [10, 27],
      popupAnchor: [-3, -76],
      shadowUrl: 'my-icon-shadow.png',
      shadowSize: [68, 95],
      shadowAnchor: [22, 94]
      });
      
      let mark: any = leaflet.marker([e.latlng.lat, e.latlng.lng],{icon: myIcon});
      markerGroup.addLayer(mark);
      this.map.addLayer(markerGroup);
      let data = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
        }
        this.counter+=1;
        console.log("test",data)
        if((this.counter%5)==0){
      this.firebaseService.createPunt(data)
      .then(
        res => {
        }); } 
        //dynamic data
        this.path.push(data); 
        //console.log(this.path, typeof this.path);  
        // for (let step in this.path)
        // { 
          
          
        //  console.log("step ",this.path[step].lat, typeof this.path[step].lat);

        // }   

    }


    logout(){
      this.authService.doLogout()
      .then(res => {
        this.navCtrl.push(LoginPage);
      })
    }

    cargar(){
        if (this.map){
          this.map.remove(); 
        }
     
     this.loadmap();
    this.getData(); 
    }

    
    removeData() {
      let alertConfirm = this.alertCtrl.create({
      title: 'Delete DataBase Points',
      message: 'Are You Sure to delete all points?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.reallyDeleteData();
          }
        }
      ]
    });
    alertConfirm.present();

    }

    reallyDeleteData () {
      this.firebaseService.getPunts()
      .then(punts => {
        this.items = punts;
        console.log(punts);
        let x: any;
        for (x in this.items) {
          this.firebaseService.deletePoint(this.items[x].payload.doc.id)
              .then(
                res => console.log('one point deleted'),
                err => console.log(err)
                );
        }   
        
      })
      this.map.remove()
      this.loadmap();
    }


    getData(){
      this.firebaseService.getPunts()
      .then(punts=> {
        this.items = punts;
        let x: any;
        let mark: any;
        // console.log(this.items);
        let markerGroup = leaflet.featureGroup();
        for (x in this.items) {
          var myIcon = leaflet.icon({
          iconUrl: '../../assets/imgs/foots.png',
          iconSize: [20, 54],
          iconAnchor: [10, 27],
          popupAnchor: [-3, -76],
          shadowUrl: 'my-icon-shadow.png',
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
          });

          mark = leaflet.marker([this.items[x].payload.doc.data().lat, this.items[x].payload.doc.data().lng],{icon: myIcon});
          markerGroup.addLayer(mark);
        }   
        this.map.addLayer(markerGroup);

      })
    }

   
    dynamicpath(){

      let markerGroup1 = leaflet.featureGroup();
       for(let step in this.path)
       {
          var myIcon = leaflet.icon({
          iconUrl: '../../assets/imgs/arrow.png',
          iconSize: [20, 54],
          iconAnchor: [10, 27],
          popupAnchor: [-3, -76],
          shadowUrl: 'my-icon-shadow.png',
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
          });

            
         let mark = leaflet.marker([+this.path[step].lat, +this.path[step].lng], {icon: myIcon}).addTo(this.map);
         markerGroup1.addLayer(mark);


       }
       this.map.addLayer(markerGroup1);
        
        

    }
    
  }