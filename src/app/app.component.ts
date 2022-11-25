import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup,Validators} from '@angular/forms';
import {faUser,faUnlock,faPaperPlane} from '@fortawesome/free-solid-svg-icons';
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
  connected:boolean = false;
constructor(private formBuilder:UntypedFormBuilder,public chat:ChatserviceService){
  this.form=this.formBuilder.group({
    User:['',[Validators.required]],
  nick:['',[Validators.required]],
  });
}
  
ngOnInit(): void {
  this.chat.init();
  
  this.irConnec();
  }
  get User() {
    return this.form.get('User');
   }
   get nick() {
   
     return this.form?.get('nick');
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
      document.getElementById('user')?.focus();
      document.getElementById('user')!.style.backgroundColor='red';
      document.getElementById('user')!.ariaPlaceholder='Coloque nickname(ejemplo: "Pepe")'
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
