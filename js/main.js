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

    	for (var i in list){
    		var li = document.createElement('li'); //creamos una lista de tipo <li>
    		ch = list[i];

    		li.dataset.charaId = ids[aux]; //guardamos la etiqueta del personaje
			li.innerHTML += ch.name + ' (HP: <strong>' + ch.hp + '</strong>/' 
  				+ ch.maxHp + ', MP: <strong>' + ch.mp + '</strong>/' + ch.maxMp + ')';

  			items.appendChild(li); //^la rellenamos y la añadimos a items (el childnodo que corresponde)
  			aux++;
    	}
    }

    // TODO: highlight current character
    var activeCh = data.activeCharacterId; //data nos da el id del personaje activo
    var highlightCh = document.querySelector ('[data-chara-id= ' + activeCh + ']'); //cogemos el personaje de la lista HTML
    highlightCh.classList.add ("active"); //le añadimos la clase active para que el css funcione
    	//para que todo esto funcione necesitamos haber guardado el id 
    		//del personaje en la lista <li>, por lo que hay que modificar la funcion insert

    // TODO: show battle actions form

    actionForm.style.display = 'inline'; //lo hacemos visible
    var actions = this.options.list(); //cogemos la lista de acciones posibles
    var options = actionForm.querySelector('[class=choices]'); //nos vamos al nodo correspondiente

    for (var i in actions){
    	var li = document.createElement('li');
        li.innerHTML += '<label><input type="radio" name="option" value=' + actions[i] + '> ' + actions[i] + '</label>';
    	options.appendChild(li);
    }//lo rellenamos con la lista <li>
    
});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
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
        // TODO: hide this menu
        // TODO: go to either select target menu, or to the select spell menu
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        // TODO: hide this menu
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        // TODO: hide this menu
        // TODO: go to select target menu
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    battle.start();
};
