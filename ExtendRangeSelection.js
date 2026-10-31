//=============================================================================
// Plugin for RPG Maker MZ
// ExtendRagngeSelection.js
//=============================================================================
// [Update History]
// 2021.Jan.26 Ver1.0.0 First Release
// 2021.Jan.30 Ver1.1.0 Fix several bugs and enables also use turn-based
// 2021.Sep.08 Ver1.1.1 Fix yet more bugs
//
/*:
 * @target MZ
 * @plugindesc [Ver1.1.1]Enable player to select disadvantage command.
 * @author Sasuke KANNAZUKI
 *
 * @param Disadvantage Color
 * @desc Command color when player selecting disadvantage command
 * @type number
 * @default 17
 *
 * @param Command Name
 * @desc Command Name of set Disadvantage
 * @type string
 * @default Disadvantage
 *
 * @orderAfter TribeScope
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 * This plugin enables player to select disavantage command.
 *
 * [Summary]
 * When player select 'Disadvantage' to command,
 * the scope of skill become opposit unit.
 * If player select the command again, command select become normal again.
 *
 * [Known Bug]
 * When some plugin defines new range, this plugin doesn't work well.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.1.1]味方への攻撃や敵の回復を可能にします。
 * @author 神無月サスケ
 *
 * @param Disadvantage Color
 * @text コマンド色
 * @desc 逆範囲選択の際のイベントコマンドの色ID　(デフォルト:17)
 * @type number
 * @default 17
 *
 * @param Command Name
 * @text 逆範囲コマンド名
 * @desc アクターのコマンドに追加されるコマンド名です。
 * @type string
 * @default 逆範囲
 *
 * @orderAfter TribeScope
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、スキルの範囲の敵味方を逆にすることを可能にします。
 *
 * ■概要
 * アクターコマンド入力中に「逆範囲」を選ぶと、コマンドの文字色が変わり、
 * 効果範囲が敵味方逆になります。
 * そのターンでもう一度「逆範囲」を選ぶと元の状態に戻ります。
 *
 * ■既知のバグ
 * 他のプラグインによって、新たな効果範囲が追加された場合、
 * うまく動作しないか、エラーが起きることがあります。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'ExtendRangeSelection';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const ColorAtDis = Number(parameters['Disadvantage Color'] || 17);
  const TextOfDis   = parameters['Command Name'] || 'Disadvantage';

  //
  // set disadvantage flag
  //
  const _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    this.disAdvantage = false;
  };

  const _Game_Action_initialize = Game_Action.prototype.initialize;
  Game_Action.prototype.initialize = function(subject, forcing) {
    _Game_Action_initialize.call(this, subject, forcing);
    this.disAdvantage = false;
  };
 
  //
  // Extend Range Selection
  //
  Game_Actor.prototype.friendsUnit = function() {
    const action = this.currentAction();
    if (action) {
      return action.disadvantage ? $gameTroop : $gameParty;
    }
    return $gameParty;
  };

  Game_Actor.prototype.opponentsUnit = function() {
    const action = this.currentAction();
    if (action) {
      return action.disadvantage ? $gameParty : $gameTroop;
    }
    return $gameTroop;
  };

  //
  // display disadvantage battler selection
  //
  const _Scene_Battle_startActorSelection =
    Scene_Battle.prototype.startActorSelection;
  Scene_Battle.prototype.startActorSelection = function() {
    if ($gameTemp.disAdvantage) {
      $gameTemp.disAdvantage = false;
      this.startEnemySelection();
      $gameTemp.disAdvantage = true;
      return;
    }
    _Scene_Battle_startActorSelection.call(this);
  };

  const _Scene_Battle_startEnemySelection =
    Scene_Battle.prototype.startEnemySelection;
  Scene_Battle.prototype.startEnemySelection = function() {
    if ($gameTemp.disAdvantage) {
      $gameTemp.disAdvantage = false;
      this.startActorSelection();
      $gameTemp.disAdvantage = true;
      return;
    }
    _Scene_Battle_startEnemySelection.call(this);
  };

  //
  // add actor command disadvantage
  //
  const _Scene_Battle_createActorCommandWindow =
   Scene_Battle.prototype.createActorCommandWindow;
  Scene_Battle.prototype.createActorCommandWindow = function() {
    _Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler('reverse',
      this.commandReverse.bind(this));
  };

  const _Window_ActorCommand_makeCommandList =
   Window_ActorCommand.prototype.makeCommandList;
  Window_ActorCommand.prototype.makeCommandList = function() {
    _Window_ActorCommand_makeCommandList.call(this);
    if (this._actor) {
      this.addReverseCommand();
    }
  };

  Window_ActorCommand.prototype.addReverseCommand = function() {
    this.addCommand(TextOfDis, 'reverse');
  };

  const _Scene_Battle_startActorCommandSelection = 
   Scene_Battle.prototype.startActorCommandSelection;
  Scene_Battle.prototype.startActorCommandSelection = function() {
    if (this._actorCommandWindow.actor() !== BattleManager.actor()) {
      $gameTemp.disAdvantage = false;
    }
    _Scene_Battle_startActorCommandSelection.call(this);
  };

  //
  // peform to toggle target and change command window color
  //
  Scene_Battle.prototype.commandReverse = function() {
    $gameTemp.disAdvantage = !$gameTemp.disAdvantage;
    const action = BattleManager.inputtingAction();
    action.disadvantage = $gameTemp.disAdvantage;
    const window = this._actorCommandWindow;
    if ($gameTemp.disAdvantage) {
      window.changeTextColor(ColorManager.textColor(ColorAtDis));
    } else {
      window.changeTextColor(ColorManager.normalColor);
    }
  };

  const _Window_Command_resetTextColor = 
    Window_Command.prototype.resetTextColor;
  Window_Command.prototype.resetTextColor = function() {
    if ($gameTemp.disAdvantage) {
      return;
    }
    _Window_Command_resetTextColor.call(this)
  };

  //
  // Solve the confliction with another plugin
  //

  // with RandomAllyRange.js
  Game_Troop.prototype.allMembers = function() {
    return this.members();
  };

  // with TribeScope.js
  if (Game_Action.prototype.isForTribe) {
    const _Game_Action_needsSelection = Game_Action.prototype.needsSelection;
    Game_Action.prototype.needsSelection = function() {
      if (this.isForTribe()) {
        return false;
      }
      return _Game_Action_needsSelection.call(this);
    };
  }

})();
