import { Component,OnInit } from '@angular/core';
import {ChatcallsService} from '../../service/chatcalls.service'
import Swal from 'sweetalert2';
import * as SendBirdCall from 'sendbird-calls';
import {faHouseSignal,faPhone,faPlus,faRightToBracket}from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.css']
})
export class CallComponent implements OnInit {
  userId:any='';
  userIdre:any='';
  roomId:any='';
  usr:string='';
  remotepart!:[SendBirdCall.RemoteParticipant];
  concat:string='';
  conc:string[]=[];
  concep:string[]=[];
  remmview:any;
  calledr!:SendBirdCall.DirectCall;
  faHouseSignal=faHouseSignal;
  faPhone=faPhone;
  faPlus=faPlus;
  faRightToBracket=faRightToBracket;
  sala!:SendBirdCall.Room;
 constructor(public call:ChatcallsService){

 }
 
  ngOnInit(): void {
    this.call.iniTsbc();
    
  }

conectar(Userid:string){
  this.call.ConnectSBC(Userid).then((e)=>{
    console.log("OK"+JSON.stringify(e));
    this.userId=e.userId;
    this.call.iniTsbc();
    this.call.EstablecerConec().then((ok)=>{
      this.call.sbc.addListener('1', {
        onRinging: (call) => {
          call.onEstablished = (call) => {
            //...
            console.log("Establecido");
           
          
            call.setRemoteMediaView((<HTMLVideoElement>document.getElementById('remote_video_element_id')))
           
        };

        call.onConnected = (call) => {
            //...
            console.log("Conected");
        };

        call.onEnded = (call) => {
            //...
            console.log("ENDED");
        };

        call.onRemoteAudioSettingsChanged = (call) => {
            //...
        };

        call.onRemoteVideoSettingsChanged = (call) => {
            //...
        };

        const acceptParams = {
          callOption: {
              localMediaView: (<HTMLVideoElement>document.getElementById('local_video_element_id')),
              remoteMediaView: (<HTMLVideoElement>document.getElementById('remote_video_element_id')),
              audioEnabled: true,
              videoEnabled: true
          }
      };

      call.accept(acceptParams);
       

        }
    });})
  },(err)=>{ 
    console.log("err");
  });
}
async okConnec(){
  const { value: invuser } = await Swal.fire({
    title: 'Conectar',
    input: 'text',
    inputLabel: 'Id de Usuario',
    inputPlaceholder: 'Coloque el id del Usuario'
  })
  
  if (invuser) {
   
    this.conectar(invuser);
  }
}
async okComake(){
  const { value: invuser } = await Swal.fire({
    title: 'Invitar a Usuario',
    input: 'text',
    inputLabel: 'Id del Usuario',
    inputPlaceholder: 'Coloque el id del Usuario'
  })
  
  if (invuser) {
    
    this.MakeFill(invuser);
  }
}
  MakeFill(CALLEE_ID:any){
    this.call.iniTsbc();
    const dialParams = {
      userId: CALLEE_ID,
      isVideoCall: true,
      callOption: {
          localMediaView: (<HTMLVideoElement>document.getElementById('local_video_element_id')),
          remoteMediaView: (<HTMLVideoElement>document.getElementById('remote_video_element_id')),
          audioEnabled: true,
          videoEnabled: true,
      }
  };
  
  
  const call = this.call.sbc.dial(dialParams, (call, error) => {
      if (error) {
          // Dialing failed.
          console.log("fallo"+error);
      }
        console.log("JOYA"+call);
        call!.onEstablished = (call) => {
          //...
          this.userIdre=call.remoteUser.userId;
          console.log('conec Establecida make'+call);
      };
      
      call!.onConnected = (call) => {
          //...call.remoteUser.userId
          
        
          console.log('conecected make'+call);
      };
      
      call!.onEnded = (call) => {
          //...
          console.log('Ended make');
      };
      
      call!.onRemoteAudioSettingsChanged = (call) => {
          //...
      };
      
      call!.onRemoteVideoSettingsChanged = (call) => {
          //...
      };
     
      const acceptParams = {
        callOption: {
            localMediaView: (<HTMLVideoElement>document.getElementById('local_video_element_id')),
            remoteMediaView: (<HTMLVideoElement>document.getElementById('remote_video_element_id')),
            audioEnabled: true,
            videoEnabled: true
        }
    };

    call!.accept(acceptParams);
        //call!.setLocalMediaView((<HTMLVideoElement>document.getElementById('local_video_element_id')));

      // Dialing succeeded.
  });
  
  
 
  //call.setLocalMediaView((<HTMLVideoElement>document.getElementById('local_video_element_id')));
  //call.setRemoteMediaView((<HTMLVideoElement>document.getElementById('remote_video_element_id')));
 
  }
 
 
createRoom(){
  this.call.CreateRoom().then((ok)=>{ 
console.log("Room created");
    console.log("ROOMID "+ok.roomId);
      this.roomId=ok.roomId;
      (<HTMLDivElement>document.getElementById('rid')).hidden=false;
      this.EntrarRomReload(ok.roomId);
      return;

  })
}
async EntrarRoom(){
  const { value: invuser } = await Swal.fire({
    title: 'Ingresar al Room',
    input: 'text',
    inputLabel: 'Id del Room',
    inputPlaceholder: 'Coloque el id del Room'
  })
  
  if (invuser) {
   this.EntrarRomReload(invuser);
   return;
  }
}
SalirdelRoom(room:SendBirdCall.Room){
  for(let partusid of room.participants){
    this.RemoveElement(partusid.user.userId);
  }
  room.exit();
  (<HTMLDivElement>document.getElementById('usrlocal')).hidden=true;
 // location.href='./?calls=ok';
  //this.call.router.navigate(['Callconn']);

}
RemoveElement(userId:string){
  this.concat='';
              
  for(let i=0; i <userId.length;i++){
    if(this.usr[i] !== ' '){
        this.concat=this.concat+userId[i];
    }
  }
  if((<HTMLDivElement>document.getElementById(this.concat+'1')) !==null){
  (<HTMLDivElement>document.getElementById(this.concat+'1')).remove();
  }
  if((<HTMLDivElement>document.getElementById(this.concat)) !==null){
  (<HTMLDivElement>document.getElementById(this.concat)).remove();
  }
  if((<HTMLDivElement>document.getElementById(this.concat+'2')) !==null){
  (<HTMLDivElement>document.getElementById(this.concat+'2')).remove();
  }
  if((<HTMLElement>document.getElementById(this.concat+'3')) !==null){
  (<HTMLElement>document.getElementById(this.concat+'3')).remove();
  }
  if((<HTMLElement>document.getElementById(this.concat+'4')) !==null){
  (<HTMLElement>document.getElementById(this.concat+'4')).remove();
  }
}
EntrarRomReload(roomId:any){
  this.call.EntrarRoom(roomId).then((ok)=>{ 
    console.log("Entramos al Room");
    const enterParams = {
      videoEnabled: true,
      audioEnabled: true
  }
  this.sala=ok;
  ok.enter(enterParams)
      .then(() => {
          // User has successfully entered `room`.
          (<HTMLDivElement>document.getElementById('usrlocal')).hidden=false;
          console.log("Entramos!!"+ ok['userId']);
          const localMediaView = (<HTMLVideoElement>document.getElementById('local_video_element_id_room'));
        // Set local media view.
        ok.localParticipant.setMediaView(localMediaView);
        
        // Called when a remote participant is connected to the media stream and starts sending the media stream.
        ok.on('remoteParticipantStreamStarted', ((remoteParticipant) => {
            // Create a new HTMLMediaElement to set remote participant's media stream.
            this.remotepart=remoteParticipant
            
           // for(let ver of remoteParticipant['user']){
             this.usr= remoteParticipant['user'].userId;
             this.concep.push(this.usr);
             if(this.usr !== ''){
              for(let i=0; i <this.usr.length;i++){
                if(this.usr[i] !== ' '){
                    this.concat=this.concat+this.usr[i];
                }
              }
              console.log("Concat "+this.concat);
             this.conc.push(this.concat);
             }
          //  }
           let d1= document.createElement('div');
           d1.setAttribute('class','col')
           d1.setAttribute('id',this.concat+'1');
           (<HTMLDivElement>document.getElementById('carga')).appendChild(d1);
           let d2= document.createElement('div');
           d2.setAttribute('class','card')
           d2.setAttribute('id',this.concat);
           (<HTMLDivElement>document.getElementById(this.concat+'1')).appendChild(d2);
            const remoteMediaView = (<HTMLVideoElement>document.createElement('video'));
            remoteMediaView.setAttribute('class','card-img-top')
            remoteMediaView.autoplay = true;
            this.remmview=remoteMediaView;
            remoteParticipant['setMediaView'](remoteMediaView);
            //document.body.appendChild(remoteMediaView);}
            (<HTMLDivElement>document.getElementById(this.concat)).appendChild(remoteMediaView);
            let d3= document.createElement('div');
            d3.setAttribute('class','card-body');
            d3.setAttribute('id',this.concat+'2');
            (<HTMLDivElement>document.getElementById(this.concat)).appendChild(d3);
            let hh= document.createElement('h5');
            hh.setAttribute('class','card-title');
            hh.setAttribute('id',this.concat+'3');
            hh.innerHTML='Nombre';
            (<HTMLDivElement>document.getElementById(this.concat+'2')).appendChild(hh);
            let pp= document.createElement('p');
            pp.setAttribute('class','card-text');
            pp.setAttribute('id',this.concat+'4');
            pp.innerHTML=this.usr;
            (<HTMLDivElement>document.getElementById(this.concat+'2')).appendChild(pp);
           //(<HTMLDivElement>document.getElementById(this.concat)).appendChild(this.remmview);
           
         
          })
            
            )
          
           ok.on('remoteParticipantEntered', (participant) => {
              // Called when a remote participant has entered the room.
              console.log("Entro "+participant['user'].userId)
              let ctn='';
             
          });
          ok.on('remoteParticipantExited', (participant) => {
              // Called when a remote participant has exited the room.
              this.concat='';
              
              for(let i=0; i <participant['user'].userId.length;i++){
                if(this.usr[i] !== ' '){
                    this.concat=this.concat+participant['user'].userId[i];
                }
              }
              if((<HTMLDivElement>document.getElementById(this.concat+'1')) !==null){
              (<HTMLDivElement>document.getElementById(this.concat+'1')).remove();
              }
              if((<HTMLDivElement>document.getElementById(this.concat)) !==null){
              (<HTMLDivElement>document.getElementById(this.concat)).remove();
              }
              if((<HTMLDivElement>document.getElementById(this.concat+'2')) !==null){
              (<HTMLDivElement>document.getElementById(this.concat+'2')).remove();
              }
              if((<HTMLElement>document.getElementById(this.concat+'3')) !==null){
              (<HTMLElement>document.getElementById(this.concat+'3')).remove();
              }
              if((<HTMLElement>document.getElementById(this.concat+'4')) !==null){
              (<HTMLElement>document.getElementById(this.concat+'4')).remove();
              }
              this.usr=participant['user'].userId;
              (<HTMLDivElement>document.getElementById('rids')).hidden=false;
              setTimeout(() => {
                (<HTMLDivElement>document.getElementById('rids')).hidden=true;
              },4000)
              console.log("Salio "+participant['user'].userId)
          });
          
      })
      .catch(e => {
          // Handle error.
          console.log("Se decocio todo "+e);
      });
  },(err)=>{ 
    console.log("Algo Malio Sal");
  })

}
ConfigAudio(){
  this.call.iniTsbc();//Por las dudas T_T
  const roomParams = {
    roomType: this.call.sbc.RoomType.LARGE_ROOM_FOR_AUDIO_ONLY
};

const enterParams = {
  videoEnabled: true,
  audioEnabled: true
}

this.call.sbc.createRoom(roomParams)
    .then(room => {
        room.enter(enterParams)
            .then(() => {
                // Set HTMLAudioElement to set audio for a large room.
                room.setAudioForLargeRoom((<HTMLVideoElement>document.getElementById('remote_video_element_id')));
            })
            .catch(e => {
                // Handle error.
                console.log("ERROR "+e);
            })
    }).catch(e => {
        // Failed to create a room.
        console.log("ERROR Al Configurar "+e);
    });

}
}
