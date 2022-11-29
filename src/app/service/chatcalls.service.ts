import { Injectable } from '@angular/core';
import * as SendBirdCall from 'sendbird-calls';
import {RouterModule, Routes,Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ChatcallsService {
  APP_ID = '3287143B-4F04-46D6-9A71-C2A36E0FAF02';
  token='12fcfdfe87746e0efb9427d2940a949ac3cd485e';
  
 sbc=SendBirdCall;//SendBirdCall.init(this.APP_ID);
  constructor(public router:Router) { }

  iniTsbc(){
    SendBirdCall.init(this.APP_ID);
  
  }

  ConnectSBC(userId:string):Promise<any>{
    this.iniTsbc()
    let errook;
    const authOption = { userId: userId, accessToken: this.token };
  return  this.sbc.authenticate(authOption, (result, error) => {
      if (error) {
          // Handle authentication failure.
          console.log("Fallo");
         errook= error;
         return error
      } else {
          // The user has been successfully authenticated and is connected to the Sendbird server.
          //...

          console.log("Connected"+result);
          errook= result;
          
          return result;
      }
  });
  
 
  }
  isConnected() {
    return this.sbc && this.sbc.currentUser && this.sbc.currentUser.userId;
  }
 EstablecerConec():Promise<void>{
  return this.sbc.connectWebSocket()
  .then(/* Succeeded to connect */(ok)=>{ console.log("ok"+ok)} )
  .catch(/* Failed to connect */(err)=>{ console.log("err"+err)});
 }
CrearSala(){

  const roomParams = {
    roomType: SendBirdCall.RoomType.SMALL_ROOM_FOR_VIDEO
};

this.sbc.createRoom(roomParams)
    .then(room => {
        console.log("Se creo La Sala")
    }).catch(e => {
      console.log("NO Se creo La Sala")
    });
}
CreateRoom():Promise<SendBirdCall.Room>{
  this.iniTsbc();//por las dudas xD
  const roomParams = {
    roomType: SendBirdCall.RoomType.SMALL_ROOM_FOR_VIDEO
};

return this.sbc.createRoom(roomParams)
    .then(room => {
        console.log("Creado");
        return room;
    }).catch(e => {
        // Failed to create a room.
        console.log("Error");
        return e;
    });
}
EntrarRoom(ROOM_ID:string):Promise<SendBirdCall.Room>{
  this.iniTsbc();//por las dudas xD
return  this.sbc.fetchRoomById(ROOM_ID)
    .then(room => {
        // `room` with the identifier `ROOM_ID` is fetched from the Sendbird Server.
        return room;
    })
    .catch(e => {
        // Handle error
        return e;
    });
}
EnterToRoom(){

 
}
}
