var rollhitdice = function(obj){
        if(
               'graphic' == obj.get('type') 
            && 'token'   == obj.get('subtype') 
            && ''        != obj.get('represents')
        )
        {
            setTimeout(_.bind(function(id){
                var obj=getObj('graphic',id)
               
                if(
                       undefined != obj 
                    && ''        == obj.get('bar3_link')
                )
                {
                    var attrib = findObjs({
                        _type: 'attribute', 
                        _characterid:obj.get('represents'),
                        name: 'npc_hpformula'
                    })
                    if( attrib.length )
                    {
                        sendChat('','/r '+attrib[0].get('current'),function(r){
                            var hp=0;
                            _.each(r,function(subr){
                                var val=JSON.parse(subr.content);
                                if(_.has(val,'total'))
                                {
                                    hp+=val.total;
                                }
                            });
                            obj.set({
                                bar3_value: hp,
                                bar3_max: hp
                            })
                        });
                    }
                }
                
            },this,obj.id), 100);
        }
    };

on('ready', function(){
    on('add:graphic', rollhitdice)
});

on("chat:message", function(msg) {
    if (msg.type == "api" && msg.content.indexOf("!rollhp") !== -1 && msg.who.indexOf("(GM)") !== -1) {
        _.each(msg.selected, function(objInfo) {
            var obj = getObj(objInfo._type, objInfo._id);
            rollhitdice(obj);
        });
    }
});
