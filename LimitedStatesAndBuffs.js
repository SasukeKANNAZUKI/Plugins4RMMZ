//=============================================================================
// Plugin for RPG Maker MV and MZ
// LimitedStatesAndBuffs.js
//=============================================================================
// [Update History]
// 2023/Dec/02 Ver1.0.0 First Release
//

/*:
 * @target MV MZ
 * @plugindesc Set Max Number of State, Buff and Debuff that affects a battler
 * @author Sasuke KANNAZUKI
 *
 * @param maxStateNum
 * @text Max State Number
 * @desc The max number of states that a battler is affected
 * @type number
 * @min 0
 * @max 9999
 * @default 1
 *
 * @param maxBuffNum
 * @text Max Buff Number
 * @desc The max number of buffs that a battler is affected
 * @type number
 * @min 0
 * @max 9999
 * @default 3
 *
 * @param maxDebuffNum
 * @text Max Debuff Number
 * @desc The max number of debuffs that a battler is affected
 * @type number
 * @min 0
 * @max 9999
 * @default 1
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) and MZ.
 *
 * This plugin enables to set max number of states, buffs and debuffs
 * that a battler is affected.
 *
 * [Summary]
 * When add new state to a battler who is already affected max number of state,
 * it removes a state that supposed to be expired first.
 *
 * In the same way, a buff or a debuff is removed when the battler is affected
 * max number of it.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc ステートや強化/弱体に最大数を設定
 * @author 神無月サスケ
 *
 * @param maxStateNum
 * @text 最大ステート数
 * @desc バトラーが一度に付与可能なステートの最大数です。
 * @type number
 * @min 0
 * @max 9999
 * @default 1
 *
 * @param maxBuffNum
 * @text 最大強化数
 * @desc バトラーが一度に付与可能な強化の最大数です。
 * @type number
 * @min 0
 * @max 9999
 * @default 3
 *
 * @param maxDebuffNum
 * @text 最大弱体数
 * @desc バトラーが一度に付与可能な弱体の最大数です。
 * @type number
 * @min 0
 * @max 9999
 * @default 3
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 *
 * このプラグインは、各バトラーに一度に付与可能な、
 * ステートや強化/弱体の数の上限を設定可能にします。
 *
 * ■概要
 * ステートや強化/弱体が設定された最大数より多く付与された場合、
 * 最も残りターン数が少ない要素が自動解除されます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'LimitedStatesAndBuffs';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const maxStateNum = Number(parameters['maxStateNum'] || 9999);
  const maxBuffNum = Number(parameters['maxBuffNum'] || 9999);
  const maxDebuffNum = Number(parameters['maxDebuffNum'] || 9999);

  //
  // define magic numbers
  //
  const MaxTurns = 9999;

  //
  // process states
  //
  const needsDiscardState = stateIds => stateIds.length >= maxStateNum;

  const stateToRemove = battler => {
    let minTurns = MaxTurns;
    let idToRemove = null;
    for (const stateId of battler._states) {
      let turns = battler._stateTurns[stateId];
      if (turns <= minTurns) {
        idToRemove = stateId;
        minTurns = turns;
      }
    }
    return idToRemove;
  };

  const processAutoRemoveState = battler => {
    if (needsDiscardState(battler._states)) {
      battler.eraseState(stateToRemove(battler));
    }
  };

  const _Game_Battler_addNewState = Game_Battler.prototype.addNewState;
  Game_Battler.prototype.addNewState = function(stateId) {
    if (maxStateNum > 0) {
      processAutoRemoveState(this);
      _Game_Battler_addNewState.call(this, stateId);
    }
  };

  //
  // process buff and debuff
  //

  const buffNumber = (buffs, isBuff) => {
    let number = 0;
    for (const buffLv of buffs) {
      if (isBuff && buffLv > 0 || !isBuff && buffLv < 0) {
        number++;
      }
    }
    return number;
  };

  const needsResetBuff = (buffs, idToAdd, isBuff) => {
    if (buffs[idToAdd] !== 0) {
      return false;
    }
    return buffNumber(buffs, isBuff) >= (isBuff ? maxBuffNum :  maxDebuffNum);
  };

  const buffToRemove = (battler, isBuff) => {
    let minTurns = MaxTurns;
    let indexToReset = null;
    for (let index = 0; index < battler._buffs.length; index++) {
      const buffLv = battler._buffs[index];
      if (isBuff && buffLv > 0 || !isBuff && buffLv < 0) {
        const turns = battler._buffTurns[index];
        if (turns <= minTurns) {
          indexToReset = index;
          minTurns = turns;
        }
      }
    }
    return indexToReset;
  };

  const processAutoResetBuff = (battler, idToAdd, isBuff) => {
    if (needsResetBuff(battler._buffs, idToAdd, isBuff)) {
      battler.eraseBuff(buffToRemove(battler, isBuff));
    }
  };

  const _Game_Battler_addBuff = Game_Battler.prototype.addBuff;
  Game_Battler.prototype.addBuff = function(paramId, turns) {
    if (maxBuffNum > 0) {
      processAutoResetBuff(this, paramId, true);
      _Game_Battler_addBuff.call(this, paramId, turns);
    }
  };

  const _Game_Battler_addDebuff = Game_Battler.prototype.addDebuff;
  Game_Battler.prototype.addDebuff = function(paramId, turns) {
    if (maxDebuffNum > 0) {
      processAutoResetBuff(this, paramId, false);
      _Game_Battler_addDebuff.call(this, paramId, turns);
    }
  };

})();
