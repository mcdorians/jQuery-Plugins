/* 
 * wheelclock plugin
 * 
 * Licensed under the MIT license.
 * Copyright 2012 Dorian Knoblauch
 */

(function( $ ){

    var methods = {
        init : function(options) { 
            return this.each(function () {
                var $this = $(this),
                data = $this.data('wheelclock');
                
                var settings = $.extend( {
                    h:0,
                    m:0,
                    s:0,
                    wheels:{},
                    timer:t=null,
                    mode:'clock',
                    seconds:true,
                    running:true,
                    clockpixelsize:200,
                    speed:500,
                    wheeltemplate: ('<div class="wc_wheel"></div>'),
                    wheelsettemplate: ('<div class="wc_wheelSet">'
                    +'<div class="wc_container wc_size wc_border wc_round">'
                    +'<div class="wc_frame wc_round wc_scale">'
                    +'</div></div></div>')
                }, options);
                    
                $(this).data('wheelclock', settings);
                data = $this.data('wheelclock');
            
                methods.setupClock.call(this,data.seconds);                
                
                methods.reset.call(this);                
                
                var _self =$(this);                
                data.timer = setInterval(function(){
                    if(_self.data('wheelclock').running){
                        methods.addSec(_self)
                    }
                }, 1000);
            });
        },
        destroy : function( ) {
            var timerid=$(this).data('wheelclock').timer
            clearInterval(timerid);
            return this.each(function(){
                $(this).html('');
                $(this).data=null;
                
            })

        },
        reset :function() {
            if( $(this).data('wheelclock').mode=='clock'){
                methods.setTime.call(this);
            }else{
                var data =$(this).data('wheelclock');
                data.h=0;
                data.m=0;
                data.s=0;
                methods.rollToTime.call(this,0,0,0);
            }
        },
        toggle :function( ) {
            $(this).data('wheelclock').running =!$(this).data('wheelclock').running;
        },
        setTime :function( ) {
            var data =$(this).data('wheelclock');
            var currentTime = new Date();
            methods.rollToTime.call(this,currentTime.getHours()
                ,currentTime.getMinutes(),currentTime.getSeconds());
                    
            data.h=currentTime.getHours();
            data.m=currentTime.getMinutes();
            data.s=currentTime.getSeconds();
        },
        buildWheelDom : function(id,numbers,pos) {
            var e = $($(this).data('wheelclock').wheeltemplate);
            $(e).addClass('wc_wheel'+pos).attr('id',id);
            var html = '';
            for(var i=0;i<=numbers;i++){
                html+=(i+'<br/>');
            }
            html+='0';
            $(e).html(html);
            $(this).data('wheelclock').wheels[id].dom=e;
            return e;
        },
        buildWheelSetDom : function(id1,num1,id2,num2,caption) { 
            var e= $($(this).data('wheelclock').wheelsettemplate);
            $('.wc_container',e).append(methods.buildWheelDom.call( this,id1,num1,1));
            $('.wc_container',e).append($('<div class="wc_split"><div class="wc_fade"></div></div>'));
            $('.wc_container',e).append(methods.buildWheelDom.call( this, id2,num2,2));
            $(e).append($('<span class="wc_caption"></span>').text(caption));
            return e;
        },
        buildDom : function(nums,captions) {
            for(var i=0;i<nums.length;i+=2){
                var wheelA={};
                wheelA.start=0;
                wheelA.dom=null;
                wheelA.num=nums[i];
                var wheelB={};
                wheelB.start=0;
                wheelB.dom=null;
                wheelB.num=nums[i+1];
                $(this).data('wheelclock').wheels['wheel'+i]=wheelA;
                $(this).data('wheelclock').wheels['wheel'+(i+1)]=wheelB;
                
                $(this).append(methods.buildWheelSetDom.call( this, 
                    ('wheel'+i),wheelA.num,'wheel'+(i+1),wheelB.num,captions[i/2]));                
            }
        },
        setupClock : function(showsec) {                       
            if(showsec){
                methods.buildDom.call( this,[2,9,5,9,5,9],['HOUR','MIN','SEC']);                
            }else{
                methods.buildDom.call( this,[2,9,5,9],['HOUR','MIN']);
            }
            $(this).data('wheelclock').clockpixelsize=parseInt($('.wc_size:last').css('height'));
        },
        addSec : function(_self) {
            var data =_self.data('wheelclock');
            var s= data.s;
            var m= data.m;
            var h=data.h;
            var size =data.clockpixelsize;
            
            s++;
                                              
            if(s==60){
                s=0;
                m++;
                if(m==60){
                    m=0;
                    h++;
                    if(h==24){
                        h=0;
                    //setup();
                    }
                    if(h%10==0){
                        var wheelA = data.wheels['wheel0'];
                        _self.append(methods.rollWheel.call(_self,wheelA,(wheelA.num+1)*size));
                    }
                    var wheelB = data.wheels['wheel1'];
                    _self.append(methods.rollWheel.call(_self,wheelB,(wheelB.num+1)*size));
                    
                }
                    
                if(m%10==0){
                    var wheelC = data.wheels['wheel2'];
                    _self.append(methods.rollWheel.call(_self,wheelC,(wheelC.num+1)*size));
                }
                var wheelD = data.wheels['wheel3'];
                _self.append(methods.rollWheel.call(_self,wheelD,(wheelD.num+1)*size));                          
                                                    
            }
            if(data.seconds){
                if(s%10==0){
                    var wheelE = data.wheels['wheel4'];
                    _self.append(methods.rollWheel.call(_self,wheelE,(wheelE.num+1)*size));  
                }
                var wheelF = data.wheels['wheel5'];
                _self.append(methods.rollWheel.call(_self,wheelF,(wheelF.num+1)*size));  
            }
            data.s=s;
            data.m=m;
            data.h=h;
        },
        rollWheel : function(wheel,k) { 
            if(wheel.start>=k){
                wheel.dom.animate({
                    top: '0px'
                }, 0, 'linear')
                wheel.start=0;
            }
            wheel.start+=$(this).data('wheelclock').clockpixelsize;
            wheel.dom.animate({
                top: '-'+wheel.start+'px'
            }, $(this).data('wheelclock').speed, 'linear');
        },
        rollToTime_helper :function(wheel1,wheel2,t) {
            var size = $(this).data('wheelclock').clockpixelsize;
            wheel1.start=(size*(Math.floor( t/10)-1));
            wheel2.start=(size*(t%10-1));
            methods.rollWheel.call(this,wheel1,2000);
            methods.rollWheel.call(this,wheel2,2000);
        },
        rollToTime :function(h,m,s) {
            var wheels =$(this).data('wheelclock').wheels;
            var wheelA = wheels['wheel0'];
            var wheelB = wheels['wheel1'];
            var wheelC = wheels['wheel2'];
            var wheelD = wheels['wheel3']; 
            methods.rollToTime_helper.call(this,wheelC,wheelD,m);
            methods.rollToTime_helper.call(this,wheelA,wheelB,h);
            
            if($(this).data('wheelclock').seconds){
                var wheelE = wheels['wheel4'];
                var wheelF = wheels['wheel5']; 
                methods.rollToTime_helper.call(this,wheelE,wheelF,s);
            }                       
        }
    };

    $.fn.wheelclock = function( method ) {
        if ( methods[method]&&(method=='destroy'||method=='reset'||method=='toggle')) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.wheelclock' );
        }    
  
    };

})( jQuery );
