//=============================================================================
// Plugin for RPG Maker MZ
// SetMaxActors.js
//=============================================================================
//[Updage History]
// 2022.May.13 Ver.1.0.0 First Release

/*:
 * @target MZ
 * @plugindesc Set Limit of Actors Number in Party
 * @author Sasuke KANNAZUKI
 *
 * @param maxActorsNumber
 * @text Max Actor Number
 * @desc Max Actor Number in the Party
 * @type number
 * @default 6

 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * This plugin set constraint the number of max actor in party.
 *
 * [Summary]
 * When it trys to add actor when number of actor is max,
 * the actor won't attend the party.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc パーティーに参加可能なアクターの上限を設定します
 * @author 神無月サスケ
 *
 * @param maxActorsNumber
 * @text 最大パーティ人数
 * @desc パーティに加えることが出来る最大のアクター数です。
 * @type number
 * @default 6

 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、パーティー人数に上限を設けます。
 *
 * ■概要
 * もし、パーティー人数が最大の時に、新たにアクターを加えようとしても、
 * そのアクターはパーティーに加わりません。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'SetMaxActors';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const maxActorsNumber = Number(parameters['maxActorsNumber'] || 6);

  //
  // exlclude actors more than max number
  //
  const adjustActors = () => {
    if ($gameParty.allMembers().length > maxActorsNumber) {
      $gameParty._actors = $gameParty._actors.slice(0, maxActorsNumber);
      $gamePlayer._followers.refresh();
    }
  };

  //
  // check actors number
  //
  const _Game_Party_setupStartingMembers =
   Game_Party.prototype.setupStartingMembers;
  Game_Party.prototype.setupStartingMembers = function() {
    _Game_Party_setupStartingMembers.call(this);
    adjustActors();
  };

  const _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
  Scene_Load.prototype.onLoadSuccess = function() {
    _Scene_Load_onLoadSuccess.call(this);
    adjustActors();
  };

  const _Game_Party_addActor = Game_Party.prototype.addActor;
  Game_Party.prototype.addActor = function(actorId) {
    _Game_Party_addActor.call(this, actorId);
    adjustActors();
  };

  // Script
  const _Game_Interpreter_command355 = Game_Interpreter.prototype.command355;
  Game_Interpreter.prototype.command355 = function() {
    const result = _Game_Interpreter_command355.call(this);
    adjustActors();
    return result;
  };

  // Plugin Command
  const _Game_Interpreter_command357 = Game_Interpreter.prototype.command357;
  Game_Interpreter.prototype.command357 = function(params) {
    const result = _Game_Interpreter_command357.call(this, params);
    adjustActors();
    return result;
  };

})();
