var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
});

battle.on('start', function (data) {
    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);

    // TODO: render the characters
   
    var listHeroes = this.characters.allFrom("heroes");//aqui tenemos a los personajes de cada bando
    var listMonsters = this.characters.allFrom("monsters");

    var HeroesIds = Object.keys(listHeroes); //necesitamos guardar los ids para el punto 2
    var MonstersIds = Object.keys(listMonsters);

    var Party1 = document.getElementById('heroes'); //accedemos a cada seccion
    var Party2 = document.getElementById('monsters');

    var items, ch;

    insert (Party1, listHeroes, HeroesIds);
    insert (Party2, listMonsters, MonstersIds);

	//creamos una funcion para no estar todo el rato haciendo lo mismo
    function insert (Party, list, ids) {

		items = Party.querySelector('[class=character-list]'); //nos vamos al childnode que queremos
		var aux = 0;
        items.innerHTML = "";

    	for (var i in list){
    		var li = document.createElement('li'); //creamos una lista de tipo <li>
    		ch = list[i];

            //if (ch.hp <= 0) li.dataset.dead = 'dead'; //si está muerto lo mostrará tachado

    		li.dataset.charaId = ids[aux]; //guardamos la etiqueta del personaje
			li.innerHTML += ch.name + ' (HP: <strong>' + ch.hp + '</strong>/' 
  				+ ch.maxHp + ', MP: <strong>' + ch.mp + '</strong>/' + ch.maxMp + ')';

  			items.appendChild(li); //^la rellenamos y la añadimos a items (el childnodo que corresponde)
  			aux++;
    	}
    }

    // TODO: highlight current character

    var activeCh = data.activeCharacterId; //data nos da el id del personaje activo
    var highlightCh = document.querySelector ('[data-chara-id= "' + activeCh + '" ]'); //cogemos el personaje de la lista HTML
    highlightCh.classList.add ('active'); //le añadimos la clase active para que el css funcione
    	//para que todo esto funcione necesitamos haber guardado el id 
    		//del personaje en la lista <li>, por lo que hay que modificar la funcion insert

    // TODO: show battle actions form

    actionForm.style.display = 'inline'; //lo hacemos visible

    var options = this.options.list(); //cogemos la lista de acciones posibles
    var choices = actionForm.querySelector('[class=choices]'); //nos vamos al nodo correspondiente
    choices.innerHTML = "";

    for (var i in options){
    	var li = document.createElement('li');
        li.innerHTML += '<label><input type="radio" name="option" value="' + options[i] +  '" required> ' + options[i] + '</label>';
    	choices.appendChild(li);
    }//lo rellenamos con la lista <li>


    //targets
    var targets = this._charactersById; //cogemos la lista de acciones posibles
    var choices = targetForm.querySelector('[class=choices]'); //nos vamos al nodo correspondiente
    choices.innerHTML = "";

    for (var i in targets){
        var li = document.createElement('li');
        li.innerHTML += '<label><input type="radio" name="option" value="' + i +  '" required> ' + i + '</label>';
        choices.appendChild(li);
    }//lo rellenamos con la lista <li>


    //spells
    var spells = this._grimoires[this._activeCharacter.party];//cogemos la lista de acciones posibles
    var choices = spellForm.querySelector('[class=choices]'); //nos vamos al nodo correspondiente
    choices.innerHTML = "";

    for (var i in spells){
        var li = document.createElement('li');
        li.innerHTML += '<label><input type="radio" name="option" value="' + i +  '" required> ' + i + '</label>';
        choices.appendChild(li);
    }//lo rellenamos con la lista <li>
    
    //spellForm.button.disabled = true; //asi se deshabilita
    //else spellForm.button.disabled = false; //asi se deja normal
});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
    

    /*var activeChTxt = prettifyEffect(data.activeCharacterId); //Wizz
    var actionTxt = prettifyEffect(data.action); //cast + 'ed'
    var scrollTxt = prettifyEffect(data.scrollName || {}); //fireball + 'on'
    var targetTxt = prettifyEffect(data.targetId); //skeleton
    var effectsTxt = prettifyEffect(data.effect || {}); //'causing ' + damage

    //infoPanel.innerHTML = activeChTxt + ' ' + actionTxt + 'ed ' + scrollTxt + 'on ' + targetTxt
            //+ 'causing ' + effectsTxt;*/

});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the action chosen by the player
        var action = actionForm.elements['option'].value;
        battle.options.select(action);

        // TODO: hide this menu
        actionForm.style.display = 'none';

        // TODO: go to either select target menu, or to the select spell menu
        if (action === 'attack') //se va a target
            targetForm.style.display = 'block';
        else if (action === 'cast')//o al menu de hechizos
            spellForm.style.display = 'block';
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        var target = targetForm.elements['option'].value;
        battle.options.select(target);

        // TODO: hide this menu
        targetForm.style.display = 'none';
    });

    targetForm.querySelector('.cancel').addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();

        targetForm.style.display = 'none'; //hide the menu and go back to the action menu
        actionForm.style.display = 'block';
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        var spell = spellForm.elements['option'].value;
        battle.options.select(spell);

        // TODO: hide this menu
        spellForm.style.display = 'none';

        // TODO: go to select target menu
        targetForm.style.display = 'block';
    });

    spellForm.querySelector('.cancel').addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();

        // TODO: hide this form
        spellForm.style.display = 'none';

        // TODO: go to select action menu
        actionForm.style.display = 'block';
    });

    battle.start();
};
