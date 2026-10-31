//=============================================================================
// Plugin for RPG Maker MZ
// AddBuffOnEvade.js
//=============================================================================
// [Update History]
// 2023.Dec.12 Ver1.0.0 First Release
// 2023.Dec.16 Ver1.1.0 It can affect plural buffs.
// 2023.Dec.17 Ver1.2.0 It can set auto state addition.
//

/*:
 * @target MZ
 * @plugindesc [Ver1.2.0]When a battler evades attack, the one sometimes invokes buff.
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * 
 * This plugin enables to invoke buff when one evade attack.
 *
 * [Summary]
 * To enable auto buff addition, write one's note(*1) as following description.
 * (*1) Note of Actor, Class, Enemy, Weapon, Armor and State.
 *
 * <evadeBuff:[Parameter],[Rank],[Turns],[Success Rate],[Animation ID]>
 * [Parameter] The parameter to add buff. See following [How to Set Parameter].
 * [Rank] Number of times to add buff. Set 1,2,3 or 4.
 *   (It's omissible. default number is 1.)
 * [Turns] Number of turns it lasts. (It's omissible. default number is 5.)
 * [Success Rate] The percentage of success. Set between 0 and 100.
 *   (It's omissible. default number is 100.)
 * [Animation ID] The animation to the target. Set 0 to not display animation.
 *   (It's omissible. default number is 51.)
 *
 * [How to Set Parameter]
 * Set either parameter id or abbr name of parameter.
 * 0 or mhp : Max HP
 * 1 or mmp : Max MP
 * 2 or atk : Attack
 * 3 or def : Defense
 * 4 or mat : M.Attack
 * 5 or mdf : M.Defense
 * 6 or agi : Agility
 * 7 or luk : Luck
 *
 * [Examples of Notation]
 * When the target evades opponent's attack...
 *
 * <evadeBuff:agi,2,4,80,52>
 * By 80% chance, add buff twice of the target's agility that lasts 4 turns.
 * Display animation whose ID is 52 when it adds buff.
 *
 * <evadeBuff:3,,20,,53>
 * By 100% chance(default), add buff once(default) of the target's
 * defense(whose id is 3) that lasts 20 turns.
 * Display animation whose ID is 53 when it adds buff.
 *
 * <evadeBuff:atk,2>
 * By 100% chance(default), add buff twice of the target's attack that lasts
 * 5 turns(default).
 * Display animation whose ID is 51(default) when it adds buff.
 *
 * <evadeBuff:4,,,,0>
 * By 100% chance(default), add buff once(default) of the target's
 * M.Attack(whose id is 4) that lasts 5 turns(default).
 * Since animation id is 0, it doesn't display animation.
 *
 *
 * [Advanced Option: Add State When One Evates] (Since Ver1.2.0)
 * The same setting as above, it's also able to set auto state addition.
 *
 * <evadeAddState:[State ID],[Success Rate],[Animation ID]>
 * [State ID] The State ID
 * [Success Rate] The percentage of success. Set between 0 and 100.
 *   (It's omissible. default number is 100.)
 * [Animation ID] The animation to the target. Set 0 to not display animation.
 *   (It's omissible. default number is 0.)
 *
 * ex.
 * When the target evades opponent's attack...
 *
 * <evadeAddState:15,75,31>
 * By 75% chance, add state 15(Default: HP Recover) and display animation
 * whose ID is 31.
 *
 * <evadeAddState:18,,42>
 * By 100% chance(default), add state 18(Default: Magic Reflection) and
 * display animation whose id is 42.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.2.0]敵からの攻撃を回避した際に強化がかかる
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインは、攻撃を回避した時に特定のパラメータを強化可能にします。
 *
 * ■概要
 * 職業、防具など(*1)のメモに、以下の書式を記述することで有効になります。
 * (*1) : アクター、敵キャラ、武器、ステートでの記述も有効です。
 *
 * <evadeBuff:[パラメータ],[段階],[継続ターン],[成功率],[アニメーションID]>
 * [パラメータ] 強化するパラメータを指定します。設定方法は後述します。
 * [段階] 何段階強化するか。1～4で指定します。省略した場合、1になります。
 * [継続ターン] 省略した場合、5になります。
 * [成功率] 成功率を％で設定します。省略した場合、100％になります。
 * [アニメーションID] 強化時に対象に表示するアニメーションです。
 *  0にするとアニメは再生されません。省略した場合、51番になります。
 *
 * ◆[パラメータ]の設定方法
 * パラメータID、またはパラメータの略称で指定します。
 * 0 または mhp : 最大HP
 * 1 または mmp : 最大MP
 * 2 または atk : 攻撃力
 * 3 または def : 防御力
 * 4 または mat : 魔法力
 * 5 または mdf : 魔法防御
 * 6 または agi : 敏捷性
 * 7 または luk : 運
 *
 * ◆設定例
 * <evadeBuff:agi,2,4,80,52>
 * 攻撃を回避した際、80％の確率で、4ターンの間、敏捷性を2段階強化します。
 * 強化の際、52番のアニメーションを表示します。
 *
 * <evadeBuff:3,,20,,53>
 * 攻撃を回避した際、100％の確率(デフォルト値)で防御力(paramIdが3)を
 * 20ターンの間、1段階(デフォルト値)強化します。
 * 強化の際、53番のアニメーションを表示します。
 *
 * <evadeBuff:atk,2>
 * 攻撃を回避した際、5ターン(デフォルト値)の間、100％の確率(デフォルト値)で
 * 攻撃力を2段階強化します。
 * 強化の際、51番(デフォルト値)のアニメーションを表示します。
 *
 * <evadeBuff:4,,,,0>
 * 攻撃を回避した際、魔法力(paramIdが4)を5ターン(デフォルト値)の間
 * 100％の確率(デフォルト値)で、1段階(デフォルト値)強化します。
 * アニメーションは0のため、表示されません。
 *
 * ■追加機能：回避時ステート付与 (Ver1.2.0～)
 * 同様に以下の書式を追加することで、回避時のステート付与を設定できます。
 *
 * <evadeAddState:[ステートID],[成功率],[アニメーションID]>
 * [ステートID] 付与するステートIDを指定します。
 * [成功率] 成功率を％で設定します。省略した場合、100％になります。
 * [アニメーションID] 強化時に対象に表示するアニメーションです。
 *  0にするとアニメは再生されません。省略した場合、0(アニメなし)になります。
 *
 * ◆例：攻撃を回避した際……
 * <evadeAddState:15,75,31>
 * 75％の確率で、15番のステート(デフォルトではHPリジェネ)を付加し、
 * 31番のアニメーションを再生します。
 *
 * <evadeAddState:18,,42>
 * 100％の確率(デフォルト)で18番のステート(デフォルトでは魔法反射)を付加し、
 * 42番のアニメーションを再生します。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {

  //
  // define parameter id and name
  //
  const paramNames = ["mhp", "mmp", "atk", "def", "mat", "mdf", "agi", "luk"];

  const paramId = paramStr => {
    if (!isNaN(+paramStr)) {
      return +paramStr;
    }
    return paramNames.indexOf(paramStr);
  };

  //
  // utility functions
  //
  const showAnimation = (battler, animationId) => {
    const logWindow = BattleManager._logWindow;
    logWindow.push("showNormalAnimation", [battler], animationId,
      battler.isActor()
    );
    logWindow.push("waitForEffect");
    logWindow.push("wait");
  };

  //
  // check if the battler has auto evade buff, and get text if it does.
  //
  const evadeBuffTextOfObj = obj => {
    const evadeBuffText = obj.meta.evadeBuff;
    if (!evadeBuffText) {
      return null;
    }
    const evadeBuffParam = evadeBuffText.split(",");
    return paramId(evadeBuffParam[0]) >= 0 ? evadeBuffParam : null;
  };

  const evadeBuffTexts = battler => {
    let textArrays = [];
    for (const obj of battler.traitObjects()) {
      const textArray = evadeBuffTextOfObj(obj);
      if (textArray) {
        textArrays.push(textArray);
      }
    }
    return textArrays;
  };
 
  //
  // invoke evade buff if condition is met
  //
  const invokeEvadeBuff = (battler, evadeBuffParam) => {
    const _paramId = paramId(evadeBuffParam[0]);
    const rank = +evadeBuffParam[1] || 1;
    const turns = +evadeBuffParam[2] || 5;
    const rate = parseInt(evadeBuffParam[3]) || 100;
    const animationId = +evadeBuffParam[4] || 0;
    if (rate > Math.randomInt(100)) {
      showAnimation(battler, animationId);
      for (let i = 0; i < rank; i++) {
        battler.addBuff(_paramId, turns);
      }
    }
  };

  const invokeEvadeBuffs = battler => {
    const textArrays = evadeBuffTexts(battler);
    for (textArray of textArrays) {
      invokeEvadeBuff(battler, textArray);
    }
  };

  //
  // check if the battler has auto evade state, and get text if it does.
  //
  const evadeStateTextOfObj = obj => {
    const evadeStateText = obj.meta.evadeAddState;
    if (!evadeStateText) {
      return null;
    }
    const evadeStateParam = evadeStateText.split(",");
    return +evadeStateParam[0] ? evadeStateParam : null;
  };

  const evadeStateTexts = battler => {
    let textArrays = [];
    for (const obj of battler.traitObjects()) {
      const textArray = evadeStateTextOfObj(obj);
      if (textArray) {
        textArrays.push(textArray);
      }
    }
    return textArrays;
  };

  //
  // invoke evade state addition if condition is met
  //
  const invokeEvadeState = (battler, evadeStateParam) => {
    const stateId = +evadeStateParam[0];
    const rate = parseInt(evadeStateParam[1]) || 100;
    const animationId = +evadeStateParam[2] || 0;
    if (rate > Math.randomInt(100)) {
      showAnimation(battler, animationId);
      battler.addState(stateId);
    }
  };

  const invokeEvadeStates = battler => {
    const textArrays = evadeStateTexts(battler);
    for (textArray of textArrays) {
      invokeEvadeState(battler, textArray);
    }
  };

  //
  // process to add states and buffs
  //
  const isEvaded = result => result.missed || result.evaded;
  
  const processEvadeBuff = battler  => {
    if (isEvaded(battler.result())) {
      invokeEvadeStates(battler);
      invokeEvadeBuffs(battler);
    }
  };

  //
  // perform display
  //
  const _Window_BattleLog_displayMiss =
    Window_BattleLog.prototype.displayMiss;
  Window_BattleLog.prototype.displayMiss = function(target) {
    _Window_BattleLog_displayMiss.call(this, target);
    processEvadeBuff(target);
  };

  const _Window_BattleLog_displayEvasion =
    Window_BattleLog.prototype.displayEvasion;
  Window_BattleLog.prototype.displayEvasion = function(target) {
    _Window_BattleLog_displayEvasion.call(this, target);
    processEvadeBuff(target);
  };
})();
