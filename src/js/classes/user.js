// Class User

function User(){
    this.idUser=null;
    this.name='anonymous';
    this.campaigns=null;
    this.chars=null;
    this.urls={
        'token':'/test/mock_json/token.json',
        'campaigns_json':'/test/mock_json/campaigns.json',
        'chars_json':'/test/mock_json/chars.json',
        'newUser':'index.html'
    };
    this.token=this.loadToken();
    this.events=new PubSub();
    this.createEvents();
    this.events.isLogin();
}

User.prototype.createEvents=function(){
    this.events.add('isLogin',this.callData.bind(this));
    this.events.add('onLoadUser',this.onLoadUser.bind(this));
    this.events.add('onNewUser',this.createNewUser.bind(this));
    this.events.add('onLoadCampaigns',this.onLoadCampaigns.bind(this));
    this.events.add('onLoadChars',this.onLoadChars.bind(this));
};

User.prototype.loadToken=function(){
    if(typeof Stores!==undefined){
        return localStorage.getItem('token');
    }
    return false;
};

User.prototype.callData=function(){
    if (this.token) {
        var ajax={
            url:this.urls.token,
            method: 'GET',
            params:{
                token:this.token,
                idUser:this.idUser
            }
        };
        loadFile(ajax)
            .then(function(resolve){
                this.insertData(JSON.parse(resolve));
                this.events.onLoadUser();
            }.bind(this),
            function(error) {
                console.error("Failed!", error);
                return false;
            });    
    }
    else {
        this.events.onNewUser();
    }
    
};

User.prototype.onLoadUser=function(){
    this.saveToken(this.token);
    this.loadCampaigns();
    this.loadChars();
};

User.prototype.insertData=function(json){
    var {name,token,idUser}=json;
    this.name=name;
    this.token=token;
    this.idUser=idUser;
};
User.prototype.saveToken=function(token){
     if(typeof Stores!==undefined){
        localStorage.setItem('token',token);
     }
};

User.prototype.loadCampaigns=function(callback){
    this.campaigns=new Campaigns(this.idUser,this.token,this.urls.campaigns_json,this.events.onLoadCampaigns.bind(this.events));
    return this;
};
User.prototype.onLoadCampaigns=function(){};

User.prototype.loadChars=function(){
    this.chars=new Chars(this.idUser,this.token,this.urls.chars_json,this.events.onLoadChars.bind(this.events));
    return this;
};
User.prototype.onLoadChars=function(result){};

User.prototype.createNewUser=function(){
    location.href=this.urls['newUser'];
};

User.prototype.getName=function(){
    return this.name;
};

User.prototype.getCampaigns=function(){
    return Object.keys(this.campaigns).map(function(x) {
                return this.campaigns[x];
            }.bind(this));
};

User.prototype.getChars=function(){
    
    return Object.keys(this.chars).map(function(x) {
        return this.chars[x];
    }.bind(this));
};