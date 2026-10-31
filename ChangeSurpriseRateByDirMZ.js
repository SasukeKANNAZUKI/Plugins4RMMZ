//=============================================================================
// ChangeSurpriseRateByDirMZ.js (Individual Specified Plugin)
//=============================================================================
// [Update History]
// [ChangeSurpriseRateByDir.js the script for MV]
// 2018.Oct.08 Ver1.0.0 First Release
// [ChangeSurpriseRateByDirMZ.js]
// 2021.Feb.12 Ver1.0.0 First Release
// 2021.Sep.07 Ver1.0.1 Fix bug "turn toward player" didn't work
// 2025.Aug.21 Ver1.1.0 Set switches (Added by Munokura)

/*:
 * @target MZ
 * @plugindesc [Ver1.1.0]On Symbol Encount System, change surprise rate according to direction.
 * @author Sasuke KANNAZUKI, Munokura
 *
 * @help
 * This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 *
 * [Summary]
 * This plugin is the order-made.
 * see https://forum.tkool.jp/index.php?threads/1300/
 * (Japanese page)
 *
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 * 
 * 
 * @param preemptiveId
 * @text Preemptive switch
 * @type switch
 * @default 0
 * @desc Specifies the switch that turns on when the actor takes the first move. Setting this to None will not work.
 *
 * @param surpriseId
 * @text Surprise switch
 * @type switch
 * @default 0
 * @desc Specifies the switch that turns on when the enemy takes the first move. Setting this to None will not work.
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.1.0]シンボルエンカウントで、イベントの向きによって先制や不意打ち率を変更します。
 * @author 神無月サスケ,ムノクラ
 *
 * @help
 * このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * ■概要
 * このプラグインは、下記の要望によって作られたオーダーメイドのプラグインです。
 * https://forum.tkool.jp/index.php?threads/1300/
 *
 * 具体的には以下の機能を実装しています。
 * ・「シンボルに背後から接触された場合」に100％の確率で不意打ち
 * ・「シンボルに背後から接触した場合」は100％の確率で先制攻撃
 *
 * ■注意
 * イベントのトリガーは必ず「イベントから接触」にしてください。
 * さもなくば、先制を取ることが出来なくなります。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 * 
 *
 * @param preemptiveId
 * @text 先制スイッチ
 * @type switch
 * @default 0
 * @desc アクターが先手を取った時にONになるスイッチを指定。なしは機能しません。
 *
 * @param surpriseId
 * @text 奇襲スイッチ
 * @type switch
 * @default 0
 * @desc 敵が先手を取った時にONになるスイッチを指定。なしは機能しません。
 */

(() => {

  const pluginName = "ChangeSurpriseRateByDirMZ";
  const params = PluginManager.parameters(pluginName);
  const PRM_preemptiveId = Number(params['preemptiveId'] || 0);
  const PRM_surpriseId = Number(params['surpriseId'] || 0);

  const _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);
    this.isBattleEventId = 0;
  };

  //
  // judge the position and direction of troop event and player
  //
  Game_Character.prototype._isEventAdjacent = function (direction, eventId) {
    const x = $gameMap.roundXWithDirection(this.x, direction);
    const y = $gameMap.roundYWithDirection(this.y, direction);
    const d = $gamePlayer.direction();
    return $gameMap.eventsXyNt(x, y).some(e => {
      return e.eventId() === eventId && e.direction() === d;
    });
  };

  Game_Character.prototype._isEventThere = function (eventId) {
    return this._isEventAdjacent(this.direction(), eventId);
  };

  Game_Character.prototype._isEventBehind = function (eventId) {
    return this._isEventAdjacent(10 - this.direction(), eventId);
  };

  //
  // change the rate of preemptive and surprise
  //
  const setSurprise = symbolEventId => {
    if ($gamePlayer._isEventThere(symbolEventId)) {
      BattleManager._preemptive = true;
      BattleManager._surprise = false;
    } else if ($gamePlayer._isEventBehind(symbolEventId)) {
      BattleManager._preemptive = false;
      BattleManager._surprise = true;
    }
    $gameTemp.notTurnTowardPlayer = false;
    if (PRM_preemptiveId > 0) {
      $gameSwitches.setValue(PRM_preemptiveId, BattleManager._preemptive);
    }
    if (PRM_surpriseId > 0) {
      $gameSwitches.setValue(PRM_surpriseId, BattleManager._surprise);
    }
  };

  const _Game_Interpreter_command301 = Game_Interpreter.prototype.command301;
  Game_Interpreter.prototype.command301 = function (params) {
    $gameTemp.isBattleEventId = this._eventId;
    const result301 = _Game_Interpreter_command301.call(this, params);
    $gameTemp.isBattleEventId = 0;
    return result301;
  };

  const _Game_Troop_setup = Game_Troop.prototype.setup;
  Game_Troop.prototype.setup = function (troopId) {
    if ($gameTemp.isBattleEventId) {
      setSurprise($gameTemp.isBattleEventId);
      $gameTemp.isBattleEventId = 0;
    }
    _Game_Troop_setup.call(this, troopId);
  };

  //
  // not to turn event at starting battle
  //
  const _Game_Event_turnTowardPlayer =
    Game_Event.prototype.turnTowardPlayer;
  Game_Event.prototype.turnTowardPlayer = function () {
    // when player touch the event, the event must not turn.
    // Otherwise, player never take preemption
    if (this.page().trigger !== 2 || !$gameMap.isEventRunning()) {
      _Game_Event_turnTowardPlayer.call(this);
    }
  };

})();