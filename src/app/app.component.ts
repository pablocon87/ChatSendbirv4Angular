import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup,Validators} from '@angular/forms';
import {faUser,faUnlock,faPaperPlane,faUserCheck} from '@fortawesome/free-solid-svg-icons';
import { UserUpdateParams } from '@sendbird/chat';
import Swal from 'sweetalert2';
import { ChatserviceService } from './service/chatservice.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'chatsbv4';
  form:UntypedFormGroup;
  faUser=faUser;
  faUnlock=faUnlock;
  faPaperPlane=faPaperPlane;
  faUserCheck=faUserCheck;
  connected:boolean = false;
  call:boolean=false;
constructor(private formBuilder:UntypedFormBuilder,public chat:ChatserviceService){
  this.form=this.formBuilder.group({
    User:['',[Validators.required]],
  nick:['',[Validators.required]],
  });
}
  
ngOnInit(): void {
  var  parts = window.location.search.substr(1).split("&");
  var $_GET = {};
  for (var i = 0; i < parts.length; i++) {
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}

let calls=$_GET['calls'];
console.log("Call"+calls);
if(calls !== undefined){
  console.log("Call DENTRO"+calls);
  this.call=true;
    this.chat.router.navigate(['Callconn']);
    return;
}
  this.chat.init();
  
  this.irConnec();
  }
  get User() {
    return this.form.get('User');
   }
   get nick() {
   
     return this.form?.get('nick');
   }
   irCall(){
this.call=true;
   }
   onConnect(event:Event){
    event.preventDefault;
    if (this.form.get('User')!.value.toString() ===''){
      document.getElementById('user')?.focus();
      document.getElementById('user')!.style.backgroundColor='red';
      document.getElementById('user')!.ariaPlaceholder='Coloque UserId(ejemplo: "Pepe")'
      return;
    }
    if (this.form.get('nick')!.value.toString() ===''){
      document.getElementById('nick')?.focus();
      document.getElementById('nick')!.style.backgroundColor='red';
      document.getElementById('nick')!.ariaPlaceholder='Coloque nickname(ejemplo: "Pepe")'
      return;
    }
    
    this.chat.connect(this.form.get('User')!.value.toString(), this.chat.token,this.form.get('nick')!.value.toString()).then((e)=>{
      const par:UserUpdateParams={
        nickname:this.form.get('nick')!.value,
        
      }
      this.chat.sb.updateCurrentUserInfo(par).then((e)=>{
        console.log('Creado'+e);
      },(err)=>{ 
        console.log("ERRor "+err);
      }).then((r)=>{
        this.connected = true;
       
        
      });
     
    },(err)=>{ console.log("Error"+err)});
   }
   irConnec(){
     this.chat.router.navigate(['/Connected']);
   }
}
