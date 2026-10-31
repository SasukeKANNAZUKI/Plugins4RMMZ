//=============================================================================
// Plugin for RPG Maker MZ
// DisplaySuddenDeath.js
//=============================================================================
// [update history]
// 2021.Feb.01 Ver1.0.0 First Release
// 2022.Jan.24 Ver1.1.0 Enables to change collapse SE for each state
// 2022.Jan.25 Ver1.2.0 When sudden death invoke, it can skip damage display.
// 2022.Jan.26 Ver1.2.1 Fix bug of Ver1.2.0

/*:
 * @target MZ
 * @plugindesc [Ver1.2.1]When immidiate death invoke, change message from normal death.
 * @author Sasuke KANNAZUKI
 *
 * @param displayDamage
 * @text Always Display Damage?
 * @desc Does it display damage even if sudden death?
 * @type boolean
 * @on Yes. Display
 * @off No. Skip
 * @default false
 *
 * @command setSe
 * @text Set Collapse SE
 * @desc Set collapse SE of each skill
 *
 * @arg stateId
 * @text Sudden Death State Id
 * @desc The State to Change Collapse SE.
 * @type state
 * @default 1
 *
 * @arg seName
 * @text Collapse SE
 * @desc Play this SE instead of normal collapse SE.
 * @dir audio/se/
 * @type file
 * @default Collapse1
 *
 * @arg volume
 * @text Volume
 * @parent seName
 * @desc volume of SE
 * @type number
 * @min 0
 * @max 100000
 * @default 100
 *
 * @arg pitch
 * @text Pitch
 * @parent seName
 * @desc pitch of SE
 * @type number
 * @default 100
 * @min 20
 * @max 1000
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 * When one dead not by damage but by sudden death skill,
 * it displays different message from default.
 *
 * [Summary]
 * To let a state be immidiate die one, write <SuddenDeath> at state's note.
 * When the actor is dead, all states including sudden death state is clear.
 *
 * Sudden death state is checked only the message of
 * "If an actor/enemy is inflicted with the state:",
 * and any other settings are ignored.
 *
 * [Setting Sample]
 * Pick up sample states whose name and messages:
 * - State Name:Decapitation    Message:%1 has decapitated!
 * - State Name:Choking death   Message:%1 is choked!
 * - State Name:Strike Pope     Message:%1 is struck one's sore point!
 *
 * [Advanced Option]
 * By Plugin Command, you can change collapse SE for each sudden death state.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.2.1]敵を即死系で倒したとき、通常と異なるメッセージを表示
 * @author 神無月サスケ
 *
 * @param displayDamage
 * @text 常にダメージ表示？
 * @desc 即死ステート時、ポップアップダメージなどのダメージを表示するか
 * @type boolean
 * @on する
 * @off しない
 * @default false
 *
 * @command setSe
 * @text コラプスSE変更
 * @desc 即死技発動時のコラプスSEを変更します
 *
 * @arg stateId
 * @text 即死ステートID
 * @desc コラプスSEを変更するステートです。コラプスではないステートの設定は無視されます。
 * @type state
 * @default 1
 *
 * @arg seName
 * @text コラプスSE
 * @desc 指定のステート時に、通常の代わりに再生するSEです。
 * @dir audio/se/
 * @type file
 * @default Collapse1
 *
 * @arg volume
 * @text ボリューム
 * @parent seName
 * @desc 再生時のボリュームです。
 * @type number
 * @min 0
 * @max 100000
 * @default 100
 *
 * @arg pitch
 * @text ピッチ
 * @parent seName
 * @desc 演奏時のピッチです。
 * @type number
 * @min 20
 * @max 1000
 * @default 100
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、付加された時、即死するステートを実現します。
 * これにより、即死系で倒した場合、通常とは異なるメッセージを表示します。
 *
 * ■概要
 * メモに <SuddenDeath> の記述がある場合、そのステートになると即死します。
 * 対象バトラー即死後、このステートを含む全てのステートが解除されます。
 *
 * 即死ステートで参照するのは、「メッセージ」の
 *「敵/味方がこの状態になったとき：」のみで、他の設定は無視されます。
 * 
 * ■使用例
 * ステート名：首はね　　　メッセージ：%1の首をはねた！
 * ステート名：即死　　　　メッセージ：%1の息の根を止めた！
 * ステート名：急所突き　　メッセージ：%1の急所を突いた！
 *
 * ■拡張機能
 * プラグインコマンドによって、各即死ステートで敵を倒したときのSEを
 * 通常のものから別のものに変更できます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'DisplaySuddenDeath';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const forceDisp = eval(parameters['displayDamage'] || 'false');

  //
  // change collapse sound
  //
  PluginManager.registerCommand(pluginName, 'setSe', args => {
    const se = {name:args.seName, volume:+args.volume, pitch:+args.pitch};
    if (!$gameSystem.suddenSe) {
      $gameSystem.suddenSe = {};
    }
    $gameSystem.suddenSe[+args.stateId] = se;
  });

  const playSuddenDeathSe = battler => {
    if (!$gameSystem.suddenSe) {
      $gameSystem.suddenSe = {};
    }
    const deathSe = $gameSystem.suddenSe[battler.suddenDeathState];
    if (deathSe) {
      AudioManager.playSe(deathSe);
      return true;
    }
    return false;
  };

  const _Game_Actor_performCollapse = Game_Actor.prototype.performCollapse;
  Game_Actor.prototype.performCollapse = function() {
    if (this.suddenDeathState) {
      if (playSuddenDeathSe(this)) {
        Game_Battler.prototype.performCollapse.call(this);
        return;
      }
    }
    _Game_Actor_performCollapse.call(this);
  };

  const _Game_Enemy_performCollapse = Game_Enemy.prototype.performCollapse;
  Game_Enemy.prototype.performCollapse = function() {
    if (this.suddenDeathState) {
      if (playSuddenDeathSe(this)) {
        Game_Battler.prototype.performCollapse.call(this);
        switch (this.collapseType()) {
        case 0:
          this.requestEffect("collapse");
          break;
        case 1:
          this.requestEffect("bossCollapse");
          break;
        case 2:
          break;
        }
        return;
      }
    }
    _Game_Enemy_performCollapse.call(this);
  };

  //
  // execute sudden death
  //
  const isSuddenDeathState = stateId => {
    const state = $dataStates[stateId];
    if (state) {
      return !!state.meta.SuddenDeath;
    }
    return false;
  };

  const isSuddenDeathBattler = battler => {
    return battler._states.some(stateId => isSuddenDeathState(stateId));
  };

  const suddenDeathState = battler => {
    return battler._states.find(stateId => isSuddenDeathState(stateId));
  };

  const executeSuddenDeath = battler => {
    battler.suddenDeathState = suddenDeathState(battler);
    battler.performCollapse();
    battler.addState(battler.deathStateId());
  };

  const resetSuddenDeath = battler => battler.suddenDeathState = null;

  const _Game_ActionResult_isStateAdded =
    Game_ActionResult.prototype.isStateAdded;
  Game_ActionResult.prototype.isStateAdded = function(stateId) {
    let realStateId = stateId;
    if (isSuddenDeathState(stateId)) {
      realStateId = Game_BattlerBase.prototype.deathStateId.call(this);
    }
    return _Game_ActionResult_isStateAdded.call(this, realStateId);
  };

  const _BattleManager_invokeAction = BattleManager.invokeAction;
  BattleManager.invokeAction = function(subject, target) {
    _BattleManager_invokeAction.call(this, subject, target);
    subject.processSuddenDeath();
    target.processSuddenDeath();
  };

  Game_Battler.prototype.processSuddenDeath = function() {
    if (isSuddenDeathBattler(this)) {
      executeSuddenDeath(this);
    }
  };

  //
  // when it invokes sudden death, it skips damage display
  //
  const doesSkipDisplay = target => !forceDisp && isSuddenDeathBattler(target);
  const doesSkipPopup = target => !forceDisp && !!target.suddenDeathState;

  const _Window_BattleLog_displayActionResults =
   Window_BattleLog.prototype.displayActionResults;
  Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    _Window_BattleLog_displayActionResults.call(this, subject, target);
    resetSuddenDeath(target);
    resetSuddenDeath(subject);
  };

  const _Window_BattleLog_displayCritical =
   Window_BattleLog.prototype.displayCritical;
  Window_BattleLog.prototype.displayCritical = function(target) {
    if (!doesSkipDisplay(target)) {
      _Window_BattleLog_displayCritical.call(this, target);
    }
  };

  const _Window_BattleLog_popupDamage = Window_BattleLog.prototype.popupDamage;
  Window_BattleLog.prototype.popupDamage = function(target) {
    if (!doesSkipPopup(target)) {
      _Window_BattleLog_popupDamage.call(this, target);
    }
  };

  const _Window_BattleLog_displayDamage =
   Window_BattleLog.prototype.displayDamage;
  Window_BattleLog.prototype.displayDamage = function(target) {
    if (!doesSkipDisplay(target)) {
      _Window_BattleLog_displayDamage.call(this, target);
    }
  };

})();
