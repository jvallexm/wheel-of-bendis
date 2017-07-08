import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import FacebookLogin from 'react-facebook-login';

export default class App extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = 
    {
      searchResult: "",
      whichTab: 0,
      loggedIn: false,
      userType: 'none',
      user: "none",
      toons: [],
      editing: {},
      needsUpdate: false,
      isNew: false
    };
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.getToEdit= this.getToEdit.bind(this);
    this.needToUpdate = this.needToUpdate.bind(this);
    this.aNewOne = this.aNewOne.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }
  componentWillMount()
  {
    this.setState({toons: this.props.toons});
  }
  componentWillUpdate()
  {
    if(this.state.needsUpdate)
      console.log("Needs update from server");
  }
  responseFacebook(response)
  {
    console.log(JSON.stringify(response));
    console.log("userid: " + response.userID);
    this.setState({user: response, loggedIn: true});
  }
  getToEdit(obj)
  {
    this.state.editing = obj;
  }
  aNewOne(boo)
  {
    this.state.isNew = boo;
  }
  needToUpdate()
  {
    console.log("attempting live update");
    this.state.needsUpdate = true;
    $.getJSON('/getall', function(data){
        var characters = [];
        for(var i=0;i<data.length;i++)
        {
           characters.push(data[i]);
        }
        this.setState({toons: characters, whichTab: 0});
    }.bind(this));
  }
  logIn()
  {
    this.setState({loggedIn: true});
  }
  logOut()
  {
    this.setState({loggedIn: false});
  }
  switchTab(num)
  {
    this.setState({whichTab: num});
  }
  render()
  {
    return(
      <div>
       {this.state.whichTab==1 ? 
       
        <div className="gray-out middle-text text-center container-fluid"> 
           <CharSearch toons={this.state.toons} cancel={this.switchTab} edit={this.getToEdit} isNew={this.aNewOne}/>
        </div> : 
        
        this.state.whichTab==2 ?
        
        <div className="gray-out middle-text text-center container-fluid"> 
           <EditChar toon={this.state.editing} cancel={this.switchTab} update={this.needToUpdate} isNew={this.state.isNew}/>
        </div>
        
        :""
        
       }
      <div className="text-center container-fluid">
      <h1 className="white-text">MARVEL Event Generator!</h1>
      <div className="text-center container-fluid app">
      <div className="text-center off-top container-fluid">
         
        <button  
          onClick={()=>this.switchTab(0)}
          className=
          {this.state.whichTab==0? "btn tab tab-on" :"btn tab tab-off" }>Event Generator!</button>
        <button  
          onClick={()=>this.switchTab(1)}
          className=
          {this.state.whichTab==1? "btn tab tab-on" : "btn tab tab-off"}>Character
          Editor!</button>
          {this.state.loggedIn? "Welcome Back" : 
          <FacebookLogin 
          cssClass="btn tab tab-off"
          appId="1586281238109787"
          autoLoad={true}
          fields="name,picture"
          callback={this.responseFacebook}
          onClick={console.log("sdfadsf")}/> }
      
        </div>  
        
      <div>
            <EventView toons={this.state.toons} />         
      </div>
       

      </div>
      </div>
      </div>
    );
  }
}

class EventView extends App
{
  constructor(props)
  {
    super(props);
    this.state={
      currentView: Math.random(),
      eventImage: "event",
      chars: [],
      teams: []
    };
    this.test = this.test.bind(this);
    this.imageCheck = this.imageCheck.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.getToons = this.getToons.bind(this);
    this.getTeams = this.getTeams.bind(this);
  }
  getToons()
  {
    var newToons = [];
    while(newToons.length<20)
    {
      var toonRoll = Math.floor(Math.random()*this.props.toons.length);
      if(this.props.toons[toonRoll].disambiguation=="")
      {
        if(newToons.indexOf(this.props.toons[toonRoll].name)==-1)
          newToons.push(this.props.toons[toonRoll].name);
      }
      else
      {
        var nameCount = 0;
        for(var i=0;i<this.props.toons.length;i++)
        {
          if(this.props.toons[i].name==this.props.toons[toonRoll].name)
           nameCount++;
        }
        if(nameCount==1 && newToons.indexOf(this.props.toons[toonRoll].name)==-1)
          newToons.push(this.props.toons[toonRoll].name);
        else if (newToons.indexOf(this.props.toons[toonRoll].name + " " + "("+this.props.toons[toonRoll].disambiguation+")")==-1)
          newToons.push(this.props.toons[toonRoll].name+ " " + "("+this.props.toons[toonRoll].disambiguation+")");
      }
      
    }
    this.state.chars = newToons;
  }
  getTeams()
  {
    var newTeams = [];
    while(newTeams.length<6)
    {
      var teams=["Runaways","S.H.I.E.L.D.","Guardians of the Galaxy","Champions","Defenders","Inhumans","Young Avengers","Secret Avengers","Avengers","X-Men","X-Force","X-Factor","X-Statix","Avengers","Alpha Flight","S.H.I.E.L.D","Brotherhood of Evil Mutants","Sinister Six","Marvel Knights","Dark X-Men","Fantastic Four","Excalibur","Agents of Atlas","Heroes For Hire","Howling Commandos","West Cost Avengers","Freedom Force","Midnight Sons","Nextwave","Power Pack","New Mutants","Thunderbolts","Mauraders","Illuminati","Future Foundation","Invaders"];
      var teamRoll = Math.floor(Math.random()*teams.length);
      if(newTeams.indexOf(teams[teamRoll])==-1)
       newTeams.push(teams[teamRoll]);
    }
    this.state.teams = newTeams;
  }
  imageCheck()
  {
    if(this.state.currentView<.2)
      this.setState({eventImage: "event-avx"});
    else if(this.state.currentView<.4)
      this.setState({eventImage: "event-secret-wars"});
    else if(this.state.currentView<.6)
      this.setState({eventImage: "event-aoa"});
    else if(this.state.currentView<.8)
      this.setState({eventImage: "event-maximum"});
    else
      this.setState({eventImage: "event-ig"});
  }
  componentWillMount()
  {
    this.getToons();
    this.getTeams();
    this.imageCheck();
  }
  componentDidMount()
  {
    var domNode = ReactDOM.findDOMNode(this);
    this.setState({currentText: domNode});
  }
  componentDidUpdate()
  {
    this.imageCheck();
    var domNode = ReactDOM.findDOMNode(this);
    this.setState({currentText: domNode});
  }
  test()
  {
    console.log(this.state.currentText.innerText.toString());
  }
  shuffle()
  {
    var coinflip = Math.random();
    this.getToons();
    this.getTeams();
    this.setState({
      currentView: coinflip,
    });
  }
  render()
  {
   return(
     <div className={this.state.eventImage}>
  <div id="words" className="inside-event middle-text">
       {this.state.currentView<.2 ? 
            <YvZ  char={this.state.chars}
                  team={this.state.teams} /> 
       :this.state.currentView<.4 ? 
            <SecretWars
                  char={this.state.chars}
                  team={this.state.teams}/>
       :this.state.currentView<.6 ? 
            <AoA
                  char={this.state.chars}
                  team={this.state.teams} />
       :this.state.currentView<.8?
      <MaximumSomething
              char={this.state.chars}
              team={this.state.teams} />:
       <InfinityGauntlet 
              char={this.state.chars}
              team={this.state.teams} /> }
        <div className="buttons">
        <button className="btn btn-red" onClick={this.shuffle}>Again!</button>
        <button className="btn btn-red"><i className="fa fa-facebook" onClick={this.test}/></button>
         <button className="btn btn-red"><i className="fa fa-twitter"/></button>
        </div>
        </div>  
      </div>
  );  
  }
}

class CharSearch extends App
{
  constructor(props)
  {
    super(props);
    this.state={
      query: "",
      result: "",
      lastSearch: "",
      foundToons: [],
      found: undefined
    }
    this.search = this.search.bind(this);
    this.handleString = this.handleString.bind(this);
    this.sendToEdit = this.sendToEdit.bind(this);
    this.sendToNew = this.sendToNew.bind(this);
  }
  componentWillMount()
  {
    this.setState({found: undefined});
  }
  sendToEdit(obj)
  {
    this.props.edit(obj);
    this.props.isNew(!this.state.found);
    this.props.cancel(2);
  }
  sendToNew(obj)
  {
    this.props.edit(obj);
    this.props.isNew(true);
    this.props.cancel(2);
  }
  handleString(e)
  {
    this.setState({query: e.target.value});
  }
  search(str)
  {
    str=str.toLowerCase();
    var regex = /(\b[a-z](?!\s))/g;
    str=str.replace(regex, (data)=>{return data.toUpperCase();});
    if(str.length==0)
      return false;
    $.getJSON('/search/' + str,(data)=>
    {
      console.log("ding data got");
      console.log(data);
      if(data.length==0)
      {
         this.setState({
          result: ("Sorry, " + str + " isn't in yet!"),
          lastSearch: str,
          query: "",
          foundToons: [],
          found: false
        });
      }
      else
      {
        this.setState({
          found: true,
          result: (str + " Found!"),
          lastSearch: str,
          query: "",
          foundToons: data
        });
      }

    });
    
    
  }
  render()
  {
    return(
       <div className="text-center middle-text container-fluid log-in-panel">
        <button className="submit-button btn btn-inverse x-btn" onClick={()=>this.props.cancel(0)}>X</button>
         <div className="name-plate search-for">
         <h4>Search For a Character!</h4>
         </div>
         <div>  
         <input 
           value={this.state.query}
           onChange={this.handleString} />            
         </div>
         <div className="result"><h5>{this.state.result}</h5></div>
         <div className="result">
            {this.state.foundToons.map((d,i)=>
              <div key={i}><h5>{d.name}{d.disambiguation!="" ? " ("+ d.disambiguation +")" : ""} <button onClick={()=>this.sendToEdit(d)} className="btn btn-inverse smol">Edit</button></h5>
              {i==this.state.foundToons.length-1 ? <h5><button className="btn btn-inverse smol" onClick={()=>this.sendToNew({_id: new Date().getTime() ,name: this.state.lastSearch, disambiguation: "",teams: "",isHero: "",list: ""})}>
              Add a New {d.name} </button></h5> : ""}
              </div>
            )}
         </div>
         <div>
         <button className="submit-button btn btn-inverse" 
                 onClick={()=>this.search(this.state.query)}
           >Submit</button>
           {this.state.found==undefined ? "" 
           :this.state.found==true ?
              ""
             :<button className="submit-button btn btn-inverse" onClick={()=> this.sendToEdit({_id: new Date().getTime() ,name: this.state.lastSearch, disambiguation: "",teams: "",isHero: "",list: ""})}>Add {this.state.lastSearch}</button>}
         </div>
       </div>);
  }
}

class EditChar extends App
{
  constructor(props)
  {
    super(props);
    this.state = {
      toon: this.props.toon,
      error: [],
      submitted: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.exit = this.exit.bind(this);
  }
  exit()
  {
    this.props.update();
    this.props.cancel(0);
  }
  submit()
  {
    console.log("Checking to submit");
    var errs = [];
    if(this.props.toon.disambiguation!="" && this.state.toon.disambiguation.length<1)
      errs.push("Character must have a disambiguation.");
    var teams = this.state.toon.teams.toUpperCase();
    var theCheck = teams.includes("THE ");
    if(theCheck==true)
      errs.push("Team names cannot contain 'The'.");
    var isHero = this.state.toon.isHero.toUpperCase();
    console.log("Is hero uppercase: " + isHero);
    if(isHero!= "TRUE" && isHero!="FALSE")
      errs.push("Hero must be 'true' or 'false'.");
    var letter = this.state.toon.list.toUpperCase();
    console.log("Is list uppercase: " + letter);
    if(letter!="A" &&  letter!="B" && letter !="C" && letter!="D" && letter!="Z" && letter.length>0)
      errs.push("List must be A, B, C, D, E");
    console.log(this.state.toon);
    if(errs.length>0)
      this.setState({error: errs});
    else
    {
      var ext = '/update/';
      if(this.props.isNew)
        ext = '/add/';
      if(this.state.toon.disambiguation=="")
        this.state.toon.disambiguation="(none)";
      console.log("Looks good to me!");
      var url = ext + this.state.toon._id +'/' +this.state.toon.name + '/' + this.state.toon.disambiguation + "/" + this.state.toon.teams + "/" + this.state.toon.isHero + "/" + this.state.toon.list;
      console.log(url);
      $.post(url,function(){
        this.props.update();
      }.bind(this));
      this.setState({submitted: true});
    }
  }
  handleChange(e)
  {
    var newToon = this.state.toon;
    var field = e.target.name;
    newToon[field] = e.target.value;
    this.setState({toon: newToon});
  }
  render()
  {
    return(       
       <div className="text-center middle-text container-fluid log-in-panel">
        {this.state.submitted ? "" : <button className="submit-button btn btn-inverse x-btn" onClick={()=>this.props.cancel(0)}>X</button>}
         
         {this.state.submitted ? <div className="search-for name-plate">
           <h4>{this.state.toon.name} {this.props.isNew ? "Added" : "Updated"}!</h4>
         </div>
         :<div className="search-for name-plate">
         <h4>{this.props.isNew ? "Adding" : "Editing"} {this.props.toon.name}</h4>
         
            <div className="text-center container-fluid">

            <div className="row">           
            <div className="col-xs-2">Alias:</div>
            <div className="col-xs-10"><input placeholder={this.props.toon.disambiguation==""? "Disambiguation" : this.props.toon.disambiguation} 
                                   value={this.state.toon.disambiguation}
                                   name="disambiguation"
                                   onChange={this.handleChange}
                                   /></div></div>
                                   
                                   
            <div className="row">           
            <div className="col-xs-2">Teams:</div>
            <div className="col-xs-10"><input placeholder="Teams, Separated, By, Comma" 
                                   value={this.state.toon.teams}
                                   name="teams"
                                   onChange={this.handleChange}
                                   /></div></div>
                       
            <div className="row">           
            <div className="col-xs-2">Hero:</div>
            <div className="col-xs-10"><input placeholder="Is Hero (True of False)"
                                   value={this.state.toon.isHero}
                                   name="isHero" 
                                   onChange={this.handleChange}
                                   /></div></div>
                                   
            <div className="row">                                
            <div className="col-xs-2">List:</div>
            <div className="col-xs-10"><input placeholder="List (A, B, C, D, or Z)"
                                   value={this.state.toon.list}
                                   name="list" 
                                   /></div></div>
                       
           </div>             
           
           <div className="result error">
              {this.state.error.map( (d,i) => <div>{d}</div> )}
           </div>
           {/*    */}
         </div>}
         
         <div>
          {this.state.submitted ? 
            <button className="submit-button btn btn-inverse" onClick={this.exit}>Go Back</button>
          :
            <button className="submit-button btn btn-inverse"
                onClick={this.submit}
           >Submit</button>}
         </div>
         
       </div>
       );
  }
}

class InfinityGauntlet extends App
{
  constructor(props)
  {
    super(props);
  }
  render()
  {
    return(    
      
       <div className="opaque">
        
        <h4>Marvel Comics Presents...</h4>
        
        <h1><strong className="red-one">Infinity Gauntlet!</strong></h1>
        
        <div className="solicit text-center container-fluid">

          <h4>Death has released <strong className="blue-one">{this.props.char[1]}</strong> from her cold embrace, and they plan to repay this debt by murdering half the universe! But even as <strong className="blue-one">{this.props.char[1]}</strong> gathers the six Infinity Gems from across the galaxy, assembling them into the Infinity Gauntlet and gaining truly godlike powers, a host of heroes gather to oppose them - including <strong className="red-one">{this.props.char[2]}</strong>, <strong className="blue-one">{this.props.char[3]}</strong>, <strong className="red-one">{this.props.char[4]}</strong>, <strong className="blue-one">{this.props.char[5]}</strong>, <strong className="red-one">{this.props.char[6]}</strong> and the <strong className="blue-one">{this.props.char[7]}</strong>! Even with <strong className="red-one">{this.props.char[8]}</strong>, <strong className="blue-one">{this.props.char[9]}</strong>, and the universe's cosmic powers aiding them, can Marvel's mightiest possibly prevail against <strong className="blue-one">{this.props.char[1]}</strong> the all-powerful? </h4>
          
        </div>
        
      </div>
      
     );
  }
}

class MaximumSomething extends App
{
  constructor(props)
  {
    super(props);
  }
  componentWillMount()
  {
  }
  render()
  {
    return(    
      
       <div className="opaque">
        
        <h4>Marvel Comics Presents...</h4>
        
        <h1><strong className="red-one">Maximum {this.props.char[0]}!</strong></h1>
        
        <div className="solicit text-center container-fluid">

          <h4>The perennial fan-favorite collection, back in print! <strong className="blue-one">{this.props.char[0]}</strong>, the spawn of <strong className="blue-one">{this.props.char[1]}</strong>, has assembled an army of <strong className="red-one">{this.props.char[2]}</strong>'s criminally insane adversaries to spread the message of hostility, chaos and wholesale slaughter: <strong className="blue-one">{this.props.char[3]}</strong>, <strong className="blue-one">{this.props.char[4]}</strong>, <strong className="blue-one">{this.props.char[5]}</strong> and the <strong className="blue-one">{this.props.char[2]} Doppelganger</strong>! Outmanned and overpowered, the wall-crawler must recruit his own band of super-beings to combat the rising tide of evil: <strong className="red-one">{this.props.char[6]}</strong>, <strong className="red-one">{this.props.char[7]}</strong>, <strong className="red-one">{this.props.char[8]}</strong>, <strong className="red-one">{this.props.char[9]}</strong>, <strong className="red-one">{this.props.char[10]}</strong> and ... <strong className="blue-one">{this.props.char[1]}</strong>?! {this.props.char[2]}'s worst enemy becomes their uneasy ally in the battle to halt <strong className="blue-one">{this.props.char[0]}</strong>'s mad rampage. But when he finds himself at odds with a number of their allies, who want to finish <strong className="blue-one">{this.props.char[0]}</strong> and their cronies once and for all, <strong className="red-one">{this.props.char[2]}</strong> must decide whether to violate their personal code of honor to rid the world of pure evil. Can they find an alternative before it's too late? Either choice carries dire consequences! </h4>          
        </div>
        
      </div>
      
     );
  }
}

class AoA extends App
{
  constructor(props)
  {
    super(props);
  }
  render()
  { 
    return(    
      
       <div className="opaque">
        
        <h4>Marvel Comics Presents...</h4>
        
        <h1><strong className="red-one">Age of {this.props.char[0]}!</strong></h1>
        
        <div className="solicit text-center container-fluid">

          <h4><strong className="red-one">{this.props.char[1]}</strong> is dead - killed twenty years in the past during a freak time-travel accident - and the world that has arisen in their absence is dark and dangerous indeed. The conqueror <strong className="blue-one">{this.props.char[0]}</strong> rules with an iron fist, ruthlessly enforcing their dictum that only the strong shall survive - and in <strong className="blue-one">{this.props.char[0]}</strong>'s long shadow, hidden among a downtrodden humankind, are a group of ragtag freedom fighters led by <strong className="red-one">{this.props.char[1]}</strong>'s oldest friend, <strong className="red-one">{this.props.char[2]}</strong>: the Amazing <strong className="blue-one">{this.props.team[0]}</strong>! When <strong className="red-one">{this.props.char[3]}</strong>, last survivor of the true Marvel Universe, locates <strong className="blue-one">{this.props.team[0]}</strong> and explains how the world went wrong, these embittered heroes and their tenuous allies must risk everything - and undertake a dangerous and multi-pronged quest - to put things right!</h4>
          
        </div>
        
      </div>
      
     );
  }
}

class SecretWars extends App
{
  constructor(props)
  {
    super(props);
  }
  render()
  {
    return(    
      
       <div className="opaque">
        
        <h4>Marvel Comics Presents...</h4>
        
        <h1><strong className="red-one">Marvel Super Heroes Secret Wars!</strong></h1>
        
        <div className="solicit text-center container-fluid">

              <h4>Drawn from Earth across the stars, the Marvel Universe's greatest villains and heroes are set against one another by the mysterious and unbelievably powerful <strong className="blue-one">{this.props.char[0]}</strong>, with the winner promised the ultimate prize. But as battle lines are drawn, new alliances forged and old enemies clash, one among them is not willing to settle for anything less than godhood. Can even the combined might of the <strong className="red-one">{this.props.team[0]}</strong>, <strong className="blue-one">{this.props.char[1]}</strong>, the <strong className="red-one">{this.props.team[1]}</strong> and the <strong className="blue-one">{this.props.team[2]}</strong> prevent <strong className="red-one">{this.props.char[2]}</strong> from becoming the most powerful being in the universe?</h4>
          
        </div>
        
      </div>
      
     );
  }
}

class YvZ extends App
{
  constructor(props)
  {
    super(props);
  }
  render()
  {
    var arr=[];
      for(var a=0;a<10;a++)
      {
        arr.push(this.props.char[a]);
      }  
    return(
      <div className="opaque">
        <h4>Marvel Comics Presents...</h4>
        <h1><strong><span className="red-one">{this.props.team[0]}</span> vs <span className="blue-one">{this.props.team[1]}</span></strong></h1>
        <div className="solicit text-center container-fluid">
          <h4>The <strong className="red-one">{this.props.team[0]}</strong> and the <strong className="blue-one">{this.props.team[1]}</strong> - the two most popular super-hero teams in history - go to war! This landmark pop-culture event brings together {
             arr.map((d,i)=> <span className={i<5 ? "red-one":"blue-one"}>{d}{i==9?" ":", "}</span>)}and more in the story that changes them forever! And experience the larger-than-life battles too big for any other comic to contain!<br /></h4> <h3>
          <span className = "red-one">{this.props.char[0]}</span> vs.  
          <span className = "blue-one"> {this.props.char[9]}</span>!<br /> 
          <span className = "red-one">{this.props.char[1]}</span> vs. 
          <span className = "blue-one"> {this.props.char[8]}</span>!<br /> 
          <span className = "red-one">{this.props.char[3]}</span> vs.  
          <span className = "blue-one"> {this.props.char[6]}</span>!</h3>
          <h4>And more! Plus: For the first time ever in print, Marvel's groundbreaking Infinite Comics are collected, revealing key events through the eyes of Marvel's major players. It's Marvel's biggest event ever - but will the <strong className="red-one">{this.props.team[0]}</strong> or the <strong className="blue-one">{this.props.team[1]}</strong> emerge triumphant?</h4>
        </div>
      </div>
    );
  }
}
