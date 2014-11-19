        Array.prototype.getItemCount = function(item) {
            var counts = {};
            for(var i = 0; i< this.length; i++) {
                var num = this[i];
                counts[num] = counts[num] ? counts[num]+1 : 1;
            }
            return counts[item] || 0;
        }

        if (!Function.prototype.bind) {
          Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
              // ближайший аналог внутренней функции
              // IsCallable в ECMAScript 5
              throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP    = function() {},
                fBound  = function() {
                  return fToBind.apply(this instanceof fNOP && oThis
                         ? this
                         : oThis,
                         aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
          };
        }


        function Slot(x, y, choices){
            
            this.x = x;
            this.y = y;
            this.current_choice = -1;
            this.interval = null;
            this.choices = choices;

        };

        Slot.prototype.clear_current_image = function(){

            if (this.current_choice > -1)
                {
                    Game.ctx.clearRect(this.x, this.y, this.choices[this.current_choice].width, this.choices[this.current_choice].height);
                }

        };

        Slot.prototype.draw_image = function(num){

            Game.ctx.drawImage(this.choices[num], this.x, this.y);

        };

        Slot.prototype.draw_next = function(){

            this.clear_current_image();

            if (this.current_choice == this.choices.length-1){
                this.current_choice = 0;
            }
            else
            {
                this.current_choice++;
            }
            
            this.draw_image(this.current_choice);

        };

        Slot.prototype.start_rotate = function(time){

            this.draw_next();
            this.interval = setInterval(this.draw_next.bind(this), time); 
        
        };

        Slot.prototype.stop_rotate = function(time){
        
            setTimeout(
                function(){
                    clearInterval(this.interval);
                    this.interval = null;
                }.bind(this), time);
        
        };

        Slot.prototype.get_current_choice = function(){

            return this.choices[this.current_choice];

        };


        Game = {
            
            choices_names: {
            	'Wild' 		 : "SYM1.png", 
            	'Strawberry' : "SYM3.png", 
            	'Ananas' 	 : "SYM4.png", 
            	'Lemon' 	 : "SYM5.png", 
            	'GreenCandy' : "SYM6.png", 
            	'Vine' 		 : "SYM7.png"
            },

            
            ctx: null,
            
            choices: [],
            
            slots : [],
            
            init: function() {
            
                var example = document.getElementById("canvas");
                this.ctx    = example.getContext('2d');

                for (var index in this.choices_names) {
                    var img = new Image();
                    img.src = "img/" + this.choices_names[index];
                    img.alt = index;
                    this.choices.push(img);

                };

                img.onload = Game.start_rotate.bind(Game);

                this.slots.push(new Slot(68,5, this.choices))
                this.slots.push(new Slot(310,5, this.choices))
                this.slots.push(new Slot(553,5, this.choices))

            },
            
            start_rotate: function(){

                for (var i = 0; i < this.slots.length; i++) {

                    this.slots[i].start_rotate((i+1)* (Math.random() * (500 - 200) + 200));

                };

            },

            stop_rotate: function(){
                for (var i = 0; i < this.slots.length; i++) {

                    this.slots[i].stop_rotate((i+1)*800);

                };
            },

            get_result: function(){
                var result = [];
                for (var i = 0; i < this.slots.length; i++) {

                    result.push(this.slots[i].get_current_choice());

                };
                return result;

            },

            push_to_select: function() {

            	var sel = document.getElementById("variants");

            	for (var index in this.choices_names) {
            		var opt = document.createElement('option');
					opt.value = index;
            		opt.innerHTML = index;

            		sel.appendChild(opt);
            	}
            }
        }


        document.getElementById('shuffle').onclick = function() {
            var this_ = this;
            var mess = document.getElementById("game_message");
            mess.innerHTML = '';
            var sel = document.getElementById("variants");
            var selected = sel.options[sel.selectedIndex].text;
                console.log("Choosed value: " + selected);
                
                this_.classList.toggle('active');
                this_.classList.add('inactive');
                this_.disabled = true;


                var arr = [];
                Game.slots = [];
                Game.init();

                setTimeout(
                    function() {
                        Game.stop_rotate();

                        this_.classList.toggle('active');
                        this_.classList.remove('inactive');
                        
                         setTimeout(
                            function() {
                                 var arrRes = Game.get_result();
                                 
                                 for (var i = 0; i < arrRes.length; i++) {
                                      arr.push(arrRes[i].getAttribute("alt"));
                                 };

                                 this_.disabled = false;

                                 console.log(arr);

                                 var count = arr.getItemCount(selected);

                                 switch (count) {
                                    case 1:
                                        mess.innerHTML = 'Good! \n You win ' + count + 'x ' + selected;
                                        break;
                                    case 2:
                                        mess.innerHTML = 'Excellent! \n You win ' + count + 'x ' + selected;
                                        break;
                                    case 3: 
                                        mess.innerHTML = 'JACKPOT! \n You win ' + count + 'x ' + selected;
                                        break;
                                    case 0:
                                        mess.innerHTML = 'No win!';
                                        break
                                 }
         
                            }, 3000);
                }, 5000);

                
        }



