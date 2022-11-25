import { Component,Directive,IterableDiffers,OnInit,AfterViewInit } from '@angular/core';
import { ChatserviceService } from 'src/app/service/chatservice.service';
import {faChevronLeft,faTimes,faPlus,faXmark,faArrowRight,faArrowLeft,faHeart,faPaperPlane,faWrench} from '@fortawesome/free-solid-svg-icons';
import { GroupChannel, GroupChannelUpdateParams } from '@sendbird/chat/groupChannel';
import Swal from 'sweetalert2';
import { AdminMessage, BaseMessage, FileMessage, MessageType, UserMessage } from '@sendbird/chat/message';
import { User, UserUpdateParams } from '@sendbird/chat';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.css']
})
export class ConnectedComponent implements OnInit,AfterViewInit {
  faChevronLeft=faChevronLeft;
  faTimes=faTimes;
  faPlus=faPlus;
  faXmark=faXmark;
  faArrowRight=faArrowRight;
  faArrowLeft=faArrowLeft;
  faHeart=faHeart;
  faPaperPlane=faPaperPlane;
  faWrench=faWrench;
  startConversationResult:string='';
  recived:boolean=false;
connected:boolean=false;
selectedChannel!:GroupChannel;
//messages: Array<UserMessage[] | FileMessage[] | AdminMessage[]> | null | undefined;
//messages!:BaseMessage[];
messages!:BaseMessage[];
listConversationsResult:string='';
conversations:GroupChannel[] | null | undefined;
textMessage:any;
chaneldel:any;
chenltype:any;
groupupdate:any;
minamesmenu:any;
hiddenme:boolean=false;
userId:any;
menusid:any;
nick!:string;
nickmem:string='';
admme:number[]=[];
addnick:string[]=[];
group!:GroupChannel;
profileurl:string='';
eventos!:Event;
stop:number=0;
  constructor(public chat:ChatserviceService){

    this.eventos = new CustomEvent('veomen', { bubbles: true,detail:{Div :()=>{
      if(HTMLDivElement['style'].height> 180){
        HTMLDivElement['scrollTo'](0, HTMLDivElement['scrollHeight']);
      }
       console.log("EVENT");
       
      }} });
 
  }

  ngOnInit():void{
    this.minamesmenu="Group Channel"
    this.userId=localStorage.getItem('userId');
   
    this.chat.sb.getChannelInvitationPreference();
    this.chat.sb.setChannelInvitationPreference(true);
    this.registerEventHandlers();
    this.getMyConversations();
    
   
    //evento.detail;
    
  
    //this.evento()
  }
  ngAfterViewInit():void{
    document.getElementById("scroll")?.addEventListener('mouseover',e=>{
      this.stop=1;
    })
    document.getElementById("scroll")?.addEventListener('mouseout',e=>{
      this.stop=0;
    })
    
    
  }
  
  evento(){
    
    return this.chat.sb;
  }
  hiden(){
    (<HTMLDivElement>document.getElementById('nav')).hidden=true;
    (<HTMLDivElement>document.getElementById('texta')).hidden=false;
    (<HTMLDivElement>document.getElementById('volv')).hidden=false;
    document.getElementById("scroll")?.scrollTo(0, document.getElementById("scroll")!.scrollHeight);
  }
LoadScroll(){
  if(this.stop===0){
 
  document.getElementById("scroll")?.scrollTo(0, document.getElementById("scroll")!.scrollHeight);
  }
}
  hidentwo(){
  this.hiddenme=true;
  console.log("ENTREEE");
  this.registerEventHandlers();
  this.getMyConversations();
  this.chat.router.navigate(['Con']);
  //  await this.selectedChannel.leave(true).then((e)=>{ 

  //   console.log("Abandone");
   
  //  },(err)=>{ 
  //   console.log("NO ABANODE"+err);
  //  });
  }
  async updprofileUser(){
    const { value: invuser } = await Swal.fire({
      title: 'Coloque Url de La imagen',
      input: 'text',
      inputLabel: 'URL Imagen',
      inputPlaceholder: 'Coloque url imagen'
    })
    
    if (invuser) {
     
      this.chat.upDateProfile(invuser).then((e)=>{
        Swal.fire(
          'Good job!',
          'Ya tienes una imagen de Perfil!',
          'success'
        )
       this.profileurl= this.chat.sb.currentUser.profileUrl;
      },(err)=>{ 
        Swal.fire(
          'Ops!',
          'Algo Malio Sal!',
          'error'
        )
      });
    }
  } 
  async invitedUser(channel:GroupChannel){
    const { value: invuser } = await Swal.fire({
      title: 'Invitar a Usuario',
      input: 'text',
      inputLabel: 'Id del Usuario',
      inputPlaceholder: 'Coloque el id del Usuario'
    })
    
    if (invuser) {
     
      this.invited(channel,invuser);
    }
  } 
  invited(channel: GroupChannel,userId:string){
    channel.inviteWithUserIds([userId]);
/*this.chat.Invitar(channel,userId).then((e)=>{
  console.log("Se Unio");
},(err)=>{ 
  console.log("NO se unio");
})*/
  }
  updateChannel(){
 
  
    for(let veo of this.conversations!){

     
      let paramst:GroupChannelUpdateParams={
        
        isPublic:true,
        isDistinct:false,
        operatorUserIds:[localStorage.getItem('userId')!],
        name:veo.name,
        coverUrl:veo.coverUrl,
        data:veo.data, 
        customType:veo.customType,
        

        //channelUrl:veo.channelUrl,
      };
     
    
    //const oki=  new GroupChannel;
    veo.updateChannel(paramst).then((e)=>{
    console.log("OK"+e);
    this.registerEventHandlers();
    this.getMyConversations();
    }, (a)=>{ console.log('NO OK'+a)})
          
    
    }
    }
  registerEventHandlers() {   
    this.chat.registerEventHandlers('123',(data:{event:any,data:any})=>{
      console.log('New event: ' + data.event + data.data);
      if (this.selectedChannel) {
        if(data.event ==='onChannelDeleted'){
          console.log("Canal Borrado");
        }
        if (data.event === 'onMessageReceived' && this.messages) {
          //console.log("Mesaje"+ JSON.stringify(this.selectedChannel))
          if (data.data.channel.url == this.selectedChannel.url) {
            this.messages.push(data.data.message);
            
            this.recived=true; 
          }
        }
        if(data.event==='onUserJoined'){
          this.chat.sendMessage(this.selectedChannel,'El usuario '+data.data.userIds+ ' Se unio al Canal').onSucceeded((e)=>{
            
                
              
              this.getMessages(this.selectedChannel);
              
            });
        }
      }
  
    })
  }
  borrarChanel(channel: GroupChannel){
    this.selectedChannel = channel;
    this.chat.Deleting(this.selectedChannel).then((e)=>{      
          this.conversations=null;
         this.registerEventHandlers();
         this.getMyConversations();
    });
  } 
  async CreateChanel(){
    const { value: groupChannel } = await Swal.fire({
      title: 'Create a new GroupChannel',
      input: 'text',
      inputLabel: 'Name Group Channel',
      inputPlaceholder: 'Enter your name groupChannel'
    })
    
    if (groupChannel) {
     
      this.startConversation(groupChannel);
    }
  } 
  startConversation(namgrup: string) {
    let channelName = namgrup;
    let userIds = [localStorage.getItem('userId')!];
    let nick=localStorage.getItem('nick')!;
    this.chat.createGroupChannel(channelName, userIds,nick).then((e)=>{

      this.startConversationResult = 'Conversation created';
      (<HTMLDivElement>document.getElementById('Res')).hidden=false;
      setTimeout(()=>{
        (<HTMLDivElement>document.getElementById('Res')).hidden=true;
      },4000)
      this.getMyConversations();
  
    },(err)=>{ 
      this.startConversationResult = 'Error creating the conversation';
  
    })
  }

  getMyConversations() {
     this.chat.getMyGroupChannels().then((e)=>{
      this.conversations=e;
      console.log('user');
      for(let ver of e){
        this.group=ver;
      }
    });
}

updateTextMessage(event: any) {
  const value = event.target.value;
              
  if (!value || !this.selectedChannel) {
    return;
  }
  
  this.textMessage = value;
}

getMessages(channel: GroupChannel) {
  document.getElementById('scroll')?.addEventListener('veomen',e=>{
    console.log("EEVVVVe "+e);
  })
  let okmen:any;
  this.hiden();
  this.selectedChannel = channel;
  
  this.chat.getMessagesFromChannel(
    channel).then((e)=>{
     console.log("EEE"+ JSON.stringify(e));
     this.messages=e;
      
     for (let ge of e){
      
    console.log("SENDER "+JSON.stringify(ge['sender']));
    
  if(ge.isUserMessage()){
   // console.log(ge['message']);
   if(ge['sender'].nickname===localStorage.getItem('nick') || ge['sender'].userId===localStorage.getItem('userId')){
    console.log("NICK "+ge['sender'].nickname);
          this.admme.push(ge.messageId);
   }
    
  }
  }})
   
  
   
}
verNick(ms:BaseMessage){
 let men;
let adm=MessageType;
if (ms.isAdminMessage()){
  this.LoadScroll();
  return 'Admin'
}else if(ms.isUserMessage()){
  this.LoadScroll();
    return ms.sender.nickname;
}
console.log("no retorno nada");
return;
}
VerMimessages(veomen:number){
  
  for(let veom of this.admme){
    if(veom === veomen){
      return true;
    }
  }
return false;
}
sendMessage() {
  
  let txtarea=document.getElementsByTagName('textarea');
  txtarea[0].value='';
  this.chat.sendMessage(this.selectedChannel,this.textMessage).onSucceeded((e)=>{
  e.messageId
      
    
    this.getMessages(this.selectedChannel);
    
  });
}
}
