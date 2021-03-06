/*
 Software License Agreement (BSD License)
 http://wwwlab.cs.univie.ac.at/~a1100570/webAD/
 Copyright (c), Volodimir Begy
 All rights reserved.


 Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following condition is met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
function Node(){
	this.color;
	this.value=0;
	this.children=undefined;
	this.parent=undefined;
	this.xPosition=0;
	this.yPosition=0;
}

function Trie(){
	this.view=new TrieView(this);
	this.db=[];
	this.actStateID=-1;
	
	var node=new Node();
	node.value="0";
	this.root=node;
	
	this.speed = 5;
	this.color1 = "#B0D6DD";
	this.color2 = "#75ADCC";
	this.color3 = "#FF7F50";
	this.running = false;
	this.stopped = false;
	this.continueAnimation = false;
}

Trie.prototype.init=function(){
	
	this.saveInDB();
}

Trie.prototype.findWords=function(tree){
	
	var words = [];
	var word = "";
	
	function recursiveTraversal(actNode, word){
		if(actNode.value==="$"){
			
			words.push(word);
			return;
		}  
		
		if(actNode.value!="0") word += actNode.value;
		var actChildren = actNode.children;
		for(var j=0;j<actChildren.length;j++){
			
			recursiveTraversal(actNode.children[j], word);
		}
		
	}
	
	if(tree.root.children!=undefined)
		recursiveTraversal(tree.root, word);
	
	return words;
}

Trie.prototype.copy=function(){
	var newTree=new Trie();

	var words = this.findWords(tree);
	for(var j=0;j<words.length;j++){
		
		newTree.addFixed(words[j]);
	}
	return newTree;
}

Trie.prototype.saveInDB=function(){

	var count=this.db.length-1;
 	if(count!=this.actStateID){
 		this.db.splice(this.actStateID+1,count-this.actStateID);
 	}

	var nextID=this.db.length;

	var new_state = this.copy();
	this.db.push(new_state);
	this.actStateID=nextID;
}

Trie.prototype.replaceThis=function(toCopy){
	
	var words = this.findWords(toCopy);
	
	this.root = undefined;
	var node = new Node();
	node.value = "0";
	this.root = node;
	
	for(var j=0;j<words.length;j++){
		
		this.addFixed(words[j]);
	}
	
	
	/*function recursivePreorderTraversal(tree, node){
		if(node===undefined)
			return;
		
		tree.addFixed(node.value); // !!!!
		
		if(node.children!=undefined)
			for(var i=0;i<node.children.length;i++)
				recursivePreorderTraversal(tree, node.children[i]);
	}
		recursivePreorderTraversal(this, toCopy.root);
	*/

}

Trie.prototype.prev=function(){
	if(this.actStateID>0){
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=this.db[prev_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

Trie.prototype.next=function(){
	if(this.actStateID<this.db.length-1){
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=this.db[next_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

Trie.prototype.firstState=function(){
	this.actStateID=0;
	var rs=this.db[0];
	//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

Trie.prototype.lastState=function(){
	var last_id=this.db.length-1;
	this.actStateID=last_id;
	var rs=this.db[last_id];
	//make actual node to THIS:
     this.replaceThis(rs);
     this.draw();
}

Trie.prototype.example=function(){
	
	var words=["cat", "car", "cone", "core"];
	
	for(var i=0;i<words.length;i++){
		this.addFixed(words[i]);
	}
	this.saveInDB();
	this.draw();
}

Trie.prototype.random=function(){
	
	var randomWords =[];
	
	// pick random number of words from 3 to 6
	do{
		var randomWordsToPick = Math.floor((Math.random() * 10)) % 7;
	}while(randomWordsToPick<3)
	
	this.root = undefined;
	var node = new Node();
	node.value = "0";
	this.root = node;
	
	var wordList = [ "add",  "age",  "and",  "ant",  "any",  "are",  "art",   "at",  "axe",
					 "bag", "back",  "bat", "bare",  "bee", "bell", "bear", "bird",  "bit", "blur", "bold", "bone",  "boy", "bowl",  "box", "byte",
					"cake",  "car", "card", "care", "carp",  "cat", "cone",  "cop", "core", "cozy", "cube",
					 "dig",  "dim",  "dip", "dirt",   "do", "dock", "doll", "done", "door", "dove",  "dry", "dull",
					"ever",  "egg", "envy",  "end", "else",
					"fast", "find", "fire", "fish",  "fit", "flip",  "fly", "fond", "four", "five",
					"gift",  "god", "gold", "gone", "good", "grid",
					"hair", "hand", "hang",  "hat", "have", "hear", "heat", "horn",  "hot", "hold",
					"life",  "lit",  "log", "long", "loop", "lost",  "lot", "love",  "low", "luck",
					"nine",  "net", "near", "neat",  "new",   "no", "node", "nope",
					 "off",  "old",   "on",   "or", "over",
					 "pad", "pair",  "pan", "park",  "paw", "pile", "pink",  "pot",
					"roar", "rose", "rant",  "red", "risk", "root",  "rob",
					"sail", "shop", "ship", "silk",  "sin", "sick", "sled", "slow", "snow", "sock", "soap", "song",
					"tail", "tale", "tall", "tell",  "tea",  "ten", "tent", "thin",  "toy", "tone", "tree", "tuna",  "two",
					"warm", "wear", "weed", "wild",  "win", "wing", "wind", "wise",  "wig", "worn",
					
					"angry", "bored", "cargo", "light", "thing", "three"
					];
	
	var wordListsize = wordList.length;
	//alert("wordListsize: "+wordListsize);
	
	for(var i=0;i<randomWordsToPick;i++){
		// generate number from 0 to 999
		var randomNumber = Math.floor((Math.random() * 1000));
		// get word at randomNumber not bigger than wordListSize
		var word = wordList[randomNumber % wordListsize];
		// add word if not already in array
		if(randomWords.indexOf(word) === -1)
			randomWords.push(word);
		else
			i--; //choose another word
	}
	
	//randomWords = ["off","bag","bat","cat"];
	
	for(var i=0;i<randomWordsToPick;i++){
		this.addFixed(randomWords[i]);
	}

	this.saveInDB();
	this.draw();
}

Trie.prototype.addFixed=function(word) {
	/* word is a character array (e.g. "cat") */
	word += "$";
	
	var actNode = this.root;
	
	for(var i=0;i<word.length;i++){
		/* if no letters exist on this level */
		if(actNode.children===undefined){
			var node = new Node();
			node.value = word.charAt(i);
			node.parent = actNode;
			actNode.children = [node];
			actNode = actNode.children[0];
		}
		else{
			/* search for current letter */
			var actChildren = actNode.children;
			var found = false;
			for(var j=0;j<actChildren.length;j++){
				var actChild = actChildren[j];
				if(actChild.value===word.charAt(i)){
					actNode = actNode.children[j];
					found = true;
					break;
				}
			}
			
			/* if current letter doesnt exist */
			if(!found){
				var node = new Node();
				node.value = word.charAt(i);
				node.parent = actNode;
				
				/* insert letter at correct position (alphabetical) */
				var letterAsciiCode = word.charAt(i).charCodeAt(0);
				var pos = actChildren.length;
				for(var j=0;j<actChildren.length;j++){
					var actChild = actChildren[j];
					var childAsciiCode = actChild.value.charCodeAt(0);
					if(childAsciiCode>letterAsciiCode){
						pos = j; 
						break;
					}
				}
				actNode.children.splice(pos, 0, node);
				actNode = actNode.children[pos];
			}	 
		}
	}
}

Trie.prototype.newTree=function() {
	
	this.root = undefined;
	var node = new Node();
	node.value = "0";
	this.root = node;
	
	this.saveInDB();
	this.draw();
}

Trie.prototype.create=function() {
	
	var cont;
	do{
		cont = false;
		var val = (prompt("Enter the number of words to add (max 10):"));
		if(val===null)
			return;
		
		if(! /^([1-9]|(10))$/.test(val)){
			alert("Value not allowed. Please enter a number from 1 to 10.");
			cont = true;
		}
	}while(cont)
	
	var words=[];
	
	for(var i=0;i<val;i++){
		
		var word = (prompt("Add word "+(i+1)+" (upper case letters are ignored):"));
		if(word===null)
			return;
		
		word = word.toLowerCase();
		
		if(! /^[a-z\u00e4\u00f6\u00fc\u00df]+$/.test(word)){
			alert("Value not allowed. Please add a word that contains only letters.");
			i--;
		}	
		else{
			if(words.indexOf(word) === -1)
				words.push(word);
			else
			{
				alert("Duplicate word. Please add a different one.");
				i--; // enter the word again
			}
		}
	}
	
	this.root = undefined;
	var node = new Node();
	node.value = "0";
	this.root = node;
	
	for(var i=0;i<words.length;i++){
		this.addFixed(words[i]);
	}
	this.saveInDB();
	this.draw();
	
}

Trie.prototype.add=function() {
	
	tree.running=true;
	
	var cont;
	do{
		cont = false;
		var word = (prompt("Add word (upper case letters are ignored):"));
		if(word===null){
			tree.running = false;
			tree.stopped = false;
			return;
		}
			
		word = word.toLowerCase();
			
		if(! /^[a-z\u00e4\u00f6\u00fc\u00df]+$/.test(word)){
			alert("Value not allowed. Please type in a word that contains only letters.");
			cont = true;
		}
	}while(cont)
		
	word += "$";

	var actNode = this.root;
	actNode.color = tree.color3;
	this.draw();
	actNode.color = tree.color2;

	var end = word.length;
	var level = 0;
	
	if(level<end) doAddLoop(actNode);
	
	// ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
	
	function doAddLoop(actNode){
		setTimeout(function (){
			
			if(actNode.children===undefined){
			
				var node = new Node();
				node.value = word.charAt(level);
				node.parent = actNode;
				actNode.children = [node];
				actNode = actNode.children[0];
			}
			/* letters exist, search for current letter */
			else{
				var actChildren = actNode.children;
				var found = false;
				for(var j=0;j<actChildren.length;j++){
					var actChild = actChildren[j];
					if(actChild.value===word.charAt(level)){
						actNode = actNode.children[j];
						found = true;
						break;
					}
				}
				
				/* if current letter doesnt exist */
				if(!found){
					var node = new Node();
					node.value = word.charAt(level);
					node.parent = actNode;
					
					/* insert letter at correct position (alphabetical) */
					var letterAsciiCode = word.charAt(level).charCodeAt(0);
					var pos = actChildren.length;
					for(var j=0;j<actChildren.length;j++){
						var actChild = actChildren[j];
						var childAsciiCode = actChild.value.charCodeAt(0);
						if(childAsciiCode>letterAsciiCode){
							pos = j;
							break;
						}
					}
					actNode.children.splice(pos, 0, node);
					actNode = actNode.children[pos];
				}
			}
			
			actNode.color = tree.color3;
			
			level++;
			
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doAddLoop(actNode);
					if(level===end) doEndLoop();
				}
				else doStopLoop(level,end,actNode);
			}
			else{
				if(tree.stopped === true) doStopLoop(level,end,actNode);
				else{
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doAddLoop(actNode);
					if(level===end) doEndLoop();
				}
			}
			
		},1000/tree.speed*5)
	}
	
	function doEndLoop(){
		setTimeout(function (){
		
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					tree.saveInDB();
					tree.draw();
					tree.running = false;
					tree.stopped = false;
				}
				else doEndLoop(actNode);
			}
			else{
				if(tree.stopped === true) doEndLoop(actNode);
				else{
					tree.saveInDB();
					tree.draw();
					tree.running = false;
					tree.stopped = false;
				}
			}
			
		},1000/tree.speed*5)
	}
	
	function doStopLoop(level,end,actNode){
		setTimeout(function (){
		
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doAddLoop(actNode);
					if(level===end) doEndLoop();
				}
				else doStopLoop(level,end,actNode);
			}
			else{
				if(tree.stopped === true) doStopLoop(level,end,actNode);
				else{
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doAddLoop(actNode);
					if(level===end) doEndLoop();
				}
			}
			
		},1000/tree.speed*5)
	}
}

Trie.prototype.search=function() { /* word search */
	
	tree.running = true;
	
	var cont;
	do{
		cont = false;
		var word = (prompt("Search for word (upper case letters are ignored):"));
		if(word===null){
			tree.running = false;
			tree.stopped = false;
			return;
		}
			
		word = word.toLowerCase();
			
		if(! /^[a-z\u00e4\u00f6\u00fc\u00df]+$/.test(word)){
			alert("Value not allowed. Please type in a word that contains only letters.");
			cont = true;
		}
	}while(cont)
	
	word += "$";
	
	var actNode = this.root;
	
	actNode.color = tree.color3;
	this.draw();
	actNode.color = tree.color2;

	var end = word.length;
	var level = 0;
	
	if(level<end)doSearchLoop(actNode);
			
	// ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
	
	function doSearchLoop(actNode){
		setTimeout(function (){
			
			if(actNode.children===undefined){
				/* no children but still letters left to search for */
				alert("The word \""+word.slice(0, -1)+"\" could not be found!");
				tree.draw();
				tree.running = false;
				tree.stopped = false;
				return;
			}
			/* letters exist, search for current letter */
			else{
				var actChildren = actNode.children;
				var found = false;
				for(var j=0;j<actChildren.length;j++){
					var actChild = actChildren[j];
					if(actChild.value===word.charAt(level)){
						actNode = actNode.children[j];
						found = true;
						break;
					}
				}
				
				/* if current letter doesnt exist */
				if(!found){
					alert("The word \""+word.slice(0, -1)+"\" could not be found!");
					tree.draw();
					tree.running = false;
					tree.stopped = false;
					return;
				}
			}
			
			actNode.color = tree.color3;
			
			level++;
			
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doSearchLoop(actNode);
					if(level===end) doEndLoop();
				}
				else doStopLoop(level,end,actNode);
			}
			else{
				if(tree.stopped === true) doStopLoop(level,end,actNode);
				else{
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doSearchLoop(actNode);
					if(level===end) doEndLoop();
				}
			}
			
		},1000/tree.speed*5)
	}
	
	function doEndLoop(){
		setTimeout(function (){
		
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					alert("The word \""+word.slice(0, -1)+"\" was found!");
					tree.draw();
					tree.running = false;
					tree.stopped = false;
				}
				else doEndLoop();
			}
			else{
				if(tree.stopped === true) doEndLoop();
				else{
					alert("The word \""+word.slice(0, -1)+"\" was found!");
					tree.draw();
					tree.running = false;
					tree.stopped = false;
				}
			}
			
		},1000/tree.speed*5)
	}
	
	function doStopLoop(level,end,actNode){
		setTimeout(function (){
		
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doSearchLoop(actNode);
					if(level===end) doEndLoop();
				}
				else doStopLoop(level,end,actNode);
			}
			else{
				if(tree.stopped === true) doStopLoop(level,end,actNode);
				else{
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doSearchLoop(actNode);
					if(level===end) doEndLoop();
				}
			}
		
		},1000/tree.speed*5)
	}
}

Trie.prototype.search2=function() { /* prefix search */
	
	tree.running = true;
	
	var cont;
	do{
		cont = false;
		var prefix = (prompt("Search for prefix (upper case letters are ignored):"));
		if(prefix===null){
			tree.running=false;
			return;
		}
			
		prefix = prefix.toLowerCase();
			
		if(! /^[a-z\u00e4\u00f6\u00fc\u00df]+$/.test(prefix)){
			alert("Value not allowed. Please type in a prefix that contains only letters.");
			cont = true;
		}
	}while(cont)
	
	var actNode = this.root;
	
	actNode.color = tree.color3;
	this.draw();
	actNode.color = tree.color2;

	var end = prefix.length;
	var level = 0;
	
	if(level<end)doSearchLoop(actNode);
			
	// ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
	
	function doSearchLoop(actNode){
		setTimeout(function (){
			
			if(actNode.children===undefined){
				/* no children but still letters left to search for */
				alert("The prefix \""+prefix+"\" could not be found!");
				tree.draw();
				tree.running = false;
				tree.stopped = false;
				return;
			}
			/* letters exist, search for current letter */
			else{
				var actChildren = actNode.children;
				var found = false;
				for(var j=0;j<actChildren.length;j++){
					var actChild = actChildren[j];
					if(actChild.value===prefix.charAt(level)){
						actNode = actNode.children[j];
						found = true;
						break;
					}
				}
				
				/* if current letter doesnt exist */
				if(!found){
					alert("The prefix \""+prefix+"\" could not be found!");
					tree.draw();
					tree.running = false;
					tree.stopped = false;
					return;
				}
			}
			
			actNode.color = tree.color3;
			
			level++;
			
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doSearchLoop(actNode);
					if(level===end) doEndLoop(actNode);
				}
				else doStopLoop(level,end,actNode);
			}
			else{
				if(tree.stopped === true) doStopLoop(level,end,actNode);
				else{
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doSearchLoop(actNode);
					if(level===end) doEndLoop(actNode);
				}
			}
			
		},1000/tree.speed*5)
	}
	
	function doEndLoop(actNode){
		setTimeout(function (){
		
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					alert("The prefix \""+prefix+"\" was found!");
					
					/* find all words with this prefix */
					var words = [];
					var word = prefix.slice(0, -1);
					
					if(actNode!=undefined)
						recursiveTraversal(actNode, word);
						
					function recursiveTraversal(actNode, word){
						if(actNode.value==="$"){
							
							words.push(word);
							return;
						}
						
						if(actNode.value!="0") word += actNode.value;
						var actChildren = actNode.children;
						
						for(var j=0;j<actChildren.length;j++){
							
							recursiveTraversal(actNode.children[j], word);
						}
					}
					
					var allWords = "";
					
					for(var i=0;i<words.length;i++){
						if(i!=0) allWords += ", ";
						allWords += words[i];
					}
					
					alert("The following words share the prefix \""+prefix+"\":\n"+allWords);
					
					tree.draw();
					tree.running = false;
					tree.stopped = false;
				}
				else doEndLoop(actNode);
			}
			else{
				if(tree.stopped === true) doEndLoop(actNode);
				else{
					alert("The prefix \""+prefix+"\" was found!");
					
					/* find all words with this prefix */
					var words = [];
					var word = prefix.slice(0, -1);
					
					if(actNode!=undefined)
						recursiveTraversal(actNode, word);
						
					function recursiveTraversal(actNode, word){
						if(actNode.value==="$"){
							
							words.push(word);
							return;
						}
						
						if(actNode.value!="0") word += actNode.value;
						var actChildren = actNode.children;
						
						for(var j=0;j<actChildren.length;j++){
							
							recursiveTraversal(actNode.children[j], word);
						}
					}
					
					var allWords = "";
					
					for(var i=0;i<words.length;i++){
						if(i!=0) allWords += ", ";
						allWords += words[i];
					}
					
					alert("The following words share the prefix \""+prefix+"\":\n"+allWords);
					
					tree.draw();
					tree.running = false;
					tree.stopped = false;
				}
			}
			
		},1000/tree.speed*5)
	}
	
	function doStopLoop(level,end,actNode){
		setTimeout(function (){
		
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doSearchLoop(actNode);
					if(level===end) doEndLoop(actNode);
				}
				else doStopLoop(level,end,actNode);
			}
			else{
				if(tree.stopped === true) doStopLoop(level,end,actNode);
				else{
					tree.draw();
					actNode.color = tree.color2;
					if(level<end) doSearchLoop(actNode);
					if(level===end) doEndLoop(actNode);
				}
			}
		
		},1000/tree.speed*5)
	}
	
}

Trie.prototype.remove=function() {

	tree.running = true;

	var cont;
	do{
		cont = false;
		var word = (prompt("Remove word (upper case letters are ignored):"));
		if(word===null){
			tree.running = false;
			tree.stopped = false;
			return;
		}
			
		word = word.toLowerCase();
			
		if(! /^[a-z\u00e4\u00f6\u00fc\u00df]+$/.test(word)){
			alert("Value not allowed. Please type in a word that contains only letters.");
			cont = true;
		}
	}while(cont)
	
	word += "$";
	
	var actNode = this.root;
	
	actNode.color = tree.color3;
	this.draw();
	actNode.color = tree.color2;
	
	var end = word.length;
	var level = 0;
	
	/* first, search for word */
	if(level<end) doSearchLoop(actNode);
	
	// ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
	
	function doSearchLoop(actNode){
		setTimeout(function (){
			
			/* if no letters exist at this level */
			if(actNode.children===undefined){
				alert("The word \""+word.slice(0, -1)+"\" could not be found!");
				tree.draw();
				tree.running = false;
				tree.stopped = false;
				return;
			}
			else{
				/* letters exist, search for current letter */
				var actChildren = actNode.children;
				var found = false;
				for(var j=0;j<actChildren.length;j++){
					var actChild = actChildren[j];
					if(actChild.value===word.charAt(level)){
						/* letter found */
						actNode = actNode.children[j];
						found = true;
						break;
					}
				}
				
				/* if current letter doesnt exist */
				if(!found){
					alert("The word \""+word.slice(0, -1)+"\" could not be found!");
					tree.draw();
					tree.running = false;
					tree.stopped = false;
					return;
				}
			}
			
			actNode.color = tree.color3;
			
			level++;
			
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					tree.draw();
					actNode.color = tree.color2;
					/* continue search */
					if(level<end) doSearchLoop(actNode);
					/* if word found, start removing letters */
					if(level===end) doRemoveLoop(actNode);
				}
				else doStopLoop(level,end,actNode);
			}
			else{
				if(tree.stopped === true) doStopLoop(level,end,actNode);
				else{
					tree.draw();
					actNode.color = tree.color2;
					/* continue search */
					if(level<end) doSearchLoop(actNode);
					/* if word found, start removing letters */
					if(level===end) doRemoveLoop(actNode);
				}
			}	
			
		},1000/tree.speed*5)
	}
	
	function doRemoveLoop(actNode){
		setTimeout(function (){
			
			if(actNode.value ==="0"){
				doEndLoop();
			}
			
			var checkNode = actNode.parent;
			
			/* If more than one child (end of remove) */
			if(checkNode.children.length > 1){
			
				var pos = checkNode.children.indexOf(actNode);
				checkNode.children.splice(pos, 1);
				
				actNode = checkNode;
				
				actNode.color = tree.color3;
				
				if(tree.speed === 0){
					if(tree.continueAnimation === true){
						tree.continueAnimation = false;
						tree.draw();
						actNode.color = tree.color2;
						doEndLoop();
					}
					else doStopLoop3(actNode);
				}
				else{
					if(tree.stopped === true) doStopLoop3(actNode);
					else{
						tree.draw();
						actNode.color = tree.color2;
						doEndLoop();
					}
				}
				
			}
			else{
				/* one child -> remove and continue */
				checkNode.children = undefined;
				actNode = checkNode;
				
				actNode.color = tree.color3;
				
				if(tree.speed === 0){
					if(tree.continueAnimation === true){
						tree.continueAnimation = false;
						tree.draw();
						actNode.color = tree.color2;
						doRemoveLoop(actNode);
					}
					else doStopLoop2(actNode);
				}
				else{
					if(tree.stopped === true) doStopLoop2(actNode);
					else{
						tree.draw();
						actNode.color = tree.color2;
						doRemoveLoop(actNode);
					}
				}
			}
			
			
			
		},1000/tree.speed*5)
	}
	
	function doEndLoop(){
		setTimeout(function (){

			if(tree.speed === 0){
					if(tree.continueAnimation === true){
						tree.continueAnimation = false;
						tree.saveInDB();
						tree.draw();
						tree.running = false;
						tree.stopped = false;
					}
					else doEndLoop();
				}
				else{
					if(tree.stopped === true) doEndLoop();
					else{
						tree.saveInDB();
						tree.draw();
						tree.running = false;
						tree.stopped = false;
					}
				}
			
		},1000/tree.speed*5)
	}
	
	function doStopLoop(level,end,actNode){
		setTimeout(function (){
			
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					tree.draw();
					actNode.color = tree.color2;
					/* continue search */
					if(level<end) doSearchLoop(actNode);
					/* if word found, start removing letters */
					if(level===end) doRemoveLoop(actNode);
				}
				else doStopLoop(level,end,actNode);
			}
			else{
				if(tree.stopped === true) doStopLoop(level,end,actNode);
				else{
					tree.draw();
					actNode.color = tree.color2;
					/* continue search */
					if(level<end) doSearchLoop(actNode);
					/* if word found, start removing letters */
					if(level===end) doRemoveLoop(actNode);
				}
			}
			
		},1000/tree.speed*5)
	}
	
	function doStopLoop2(actNode){
		setTimeout(function (){
		
			if(tree.speed === 0){
				if(tree.continueAnimation === true){
					tree.continueAnimation = false;
					doRemoveLoop(actNode);
				}
				else doStopLoop2(actNode);
			}
			else{
				if(tree.stopped === true) doStopLoop2(actNode);
				else{
					doRemoveLoop(actNode);
				}
			}
		
		},1000/tree.speed*5)
	}
	
	function doStopLoop3(actNode){
		setTimeout(function (){
		
			if(tree.speed === 0){
					if(tree.continueAnimation === true){
						tree.continueAnimation = false;
						doEndLoop();
					}
					else doStopLoop3(actNode);
				}
				else{
					if(tree.stopped === true) doStopLoop3(actNode);
					else{
						doEndLoop();
					}
				}
		
		},1000/tree.speed*5)
	}
	
}

Trie.prototype.draw=function(){
	this.view.draw();
}


