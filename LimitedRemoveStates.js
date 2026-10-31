//=============================================================================
// Plugin for RPG Maker MZ
// LimitedRemoveStates.js
//=============================================================================

// [Update History]
// 2023.Aug.02 Ver1.0.0 First Release
// 2025.Jan.07 Ver1.1.0 It can set plural StateType to item/skill.
//

/*:
 * @target MZ
 * @plugindesc [Ver1.1.0]Make skill/item that removes specified number of states
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * This plugin enables to make skills/items that remove states and/or buffs
 * at most specified number.
 *
 * [Summary]
 * This plugin enables to make skills/items as follows:
 * - Skill that removes at most 2 states in Poison/Sleep/Numb/Confuse:
 *  Even if the target battler is affected by more than 2 states of above,
 *  the skill will remove only 2 states.
 * - Skill that reset at most 1 buff:
 *  Even if the target takes more than 1 buff, for example def and agi,
 *  the skill removes only 1 buff.
 * - Skill that removes at most 3 specified states and debuffs:
 *  For example, target is affected 1 specified state, the skill resets
 *  at most 2 debuffs.
 *
 * [How to Set Skill/Item Above]
 * Write following tags to the note of skill/item, and state.
 * 
 * [[Set state type to any states(Optional)]] 
 * Write the state's note as following style:
 * <StateType:Basic>
 *   Where "Basic" is the state type name.
 *   You can replace its name to another name according the state's name
 *   that you want to remove.
 *
 * [[How to make skill/item that removes states of specified number]]
 * Declare skill/item's note as follows:
 * <RemoveStateNum:2>
 *   Where 2 is the number of states to remove. Change different number.
 *
 * - To set states that can remove by the skill/item:
 * <TargetState:4,5,6>
 *   Where 4,5,6 is the state ids that the skill/item can remove.
 * <StateType:Basic>
 *   Where 'Basic' is the state type that the skill/item can remove.
 * NOTE:You can also declare both of above.
 *
 * You can set plural state types at StateType.(Since Ver1.1.0)
 * <StateType:Basic,Advanced>
 * In this case, the skill/item can remove state whose type is either Basic or
 * Advanced.
 *
 * - To set the skill/item also reset buff/debuff:
 * <RemoveAlsoBuff>
 *   When declare this, the skill will also remove target's buffs.
 * <RemoveAlsoDebuff>
 *   When declare this, the skill will also remove target's debuffs.
 * NOTE:These 2 tags are valid only when RemoveStateNum tag is set.
 *
 * [[How to make skill/item that reset buffs/debuffs of specified number]]
 * Declare skill/item's note as follows:
 * <RemoveDebuffNum:2>
 *   When declare this, it resets 2 debuff states.
 *   Change the number as you like.
 * <RemoveBuffNum:1>
 *   When declare this, it resets 1 buff state.
 *
 * [NOTE]
 * - When remove a state, it removes one that is highest priority.
 * - When reset a buff/debuff, priority is following:
 *   MaxHP > MaxMP > atk > def > mat > mdf > agi > luk
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.1.0]特定の数だけステートや強化/弱体を解除するスキルやアイテムの作成
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインは、たかだか指定した数だけステートや強化/弱体を解除する
 * スキルやアイテムを作成可能にします。
 *
 * ■概要
 * このプラグインでは、以下のような特徴のスキルやアイテムを作成可能にします。
 * ・「毒、睡眠、麻痺、混乱のうちふたつだけ解除する」スキル：
 * 　対象キャラに毒、睡眠、麻痺、混乱のうち３つ以上のステートが
 *   付与されていても、そのうちふたつだけしか治療せず、残りは治療しません。
 * ・任意の複数のステータスが強化されているとき、ひとつだけ解除するスキル：
 *   防御力と敏捷性に強化がかかっていても、いずれか一方だけしか解除しません。
 * ・「任意のステートおよび、任意の弱体のうち、最高３つまで治療するスキル：
 * 　例えば、治療可能なステートのうちひとつしか付与されていない場合、
 *   そのステートの解除とともに、付与されている弱体を最高ふたつまで解除します。
 *
 * ■設定方法
 * 対象のスキルやアイテム、そして対象のステートのメモにて設定を行います。
 *
 * ◆ステートにタイプの設定(任意)
 * ステートのメモに、以下のように記述します。
 * <StateType:Basic>
 *   Basicの箇所を、任意の文字列に置き換えてください。
 *
 * ◆任意の数のステートを解除するスキル/アイテムの設定
 * スキル/アイテムのメモに、以下のように記述します。
 * <RemoveStateNum:2>
 *   2の部分には「RemoveStateNum」タグに解除するステート数を指定します。
 *
 * ・治療可能なステートの設定
 * <TargetState:4,5,6>
 *   IDが4,5,6のステートを解除するスキルになります。
 * <StateType:Basic>
 *   ステートタイプが指定の文字列(ここではBasic)のステートを
 *   解除するスキルになります。
 * 上記ふたつを両方指定することも可能です。
 *
 * なおスキル/アイテムでは解除したいStateTypeは複数指定可能です。(Ver1.1.0～)
 * <StateType:Basic,Advanced>
 * このようにコンマで区切ることにより、複数のステートタイプが指定可能です。
 *
 * ・弱体/強化も解除可能にする設定
 * <RemoveAlsoBuff>
 *   ステートのみならず、強化の解除も行います。
 * <RemoveAlsoDebuff>
 *   上記と同様、弱体の解除も行います。
 * ※これらはRemoveStateNumタグが設定されている場合のみ有効です。
 *
 * ◆任意の数の強化/弱体を解除するスキル/アイテムの設定
 * スキル/アイテムのメモに、以下のように記述します。
 * <RemoveDebuffNum:1>
 *   指定した数の弱体を解除します。1の部分を任意の数字に置き換えてください。
 * <RemoveBuffNum:1>
 *   指定した数の強化を解除します。
 *
 * ■補足
 * - 複数のステートを解除する時は、優先度の高いステートから順に解除されます。
 * - 強化/弱体を解除する時は、以下の優先順位になります：
 *   最大HP > 最大MP > 攻撃力 > 防御力 > 魔法力 > 魔法防御 > 敏捷性 > 運
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'LimitedRemoveStates';

  //
  // apply limited remove stats and/or reset buff/debuff
  //
  const _Game_Action_applyItemUserEffect =
   Game_Action.prototype.applyItemUserEffect;
  Game_Action.prototype.applyItemUserEffect = function(target) {
    this.removeStatesAndBuffs(target, this.item());
    _Game_Action_applyItemUserEffect.call(this, target);
  };

  Game_Action.prototype.removeStatesAndBuffs = function(battler, item) {
    if (removeStatesAndBuffs(battler, item)) {
      this.makeSuccess(battler);
    }
  };

  const removeStatesAndBuffs = (battler, item) => {
    if (!battler || !item) {
      return false;
    }
    let result = false;
    if (item.meta.RemoveStateNum) {
      result = removeStates(battler, item);
    }
    if (item.meta.RemoveBuffNum) {
      result |= removeBuffs(battler, +item.meta.RemoveBuffNum, true);
    }
    if (item.meta.RemoveDebuffNum) {
      result |= removeBuffs(battler, +item.meta.RemoveDebuffNum, false);
    }
    return result;
  };

  //
  // get and remove states that specified skill/item can remove
  //
  const removableStateIds = item => {
    let stateIds = [];
    let s;
    if (s = item.meta.TargetState) {
      stateIds = stateIds.concat(s.split(",").map(st => +st));
    }
    if (s = item.meta.StateType) {
      const s2 = $dataStates.filter(st => st &&
        s.split(",").includes(st.meta.StateType)
      );
      stateIds = stateIds.concat(s2.map(st => st.id));
    }
    return stateIds;
  };

  const statesToRemove = (item, _states) => {
    const stateIds = [];
    const removable = removableStateIds(item);
    let numToRemove = +item.meta.RemoveStateNum;
    if (!numToRemove || numToRemove < 0) {
      return [];
    }
    for (const stateId of _states) {
      if (removable.includes(stateId)) {
        stateIds.push(stateId);
        if (--numToRemove === 0) {
          break;
        }
      }
    }
    return stateIds;
  };

  const removeStates = (battler, item) => {
    if (!battler || !item) {
      return false;
    }
    let result = false;
    const stateIds = statesToRemove(item, battler._states);
    for (let stateId of stateIds) {
      battler.removeState(stateId);
      result = true;
    }
    const numToRemove = +item.meta.RemoveStateNum - stateIds.length;
    if (item.meta.RemoveAlsoBuff) {
      result |= removeBuffs(battler, numToRemove, true);
    }
    if (item.meta.RemoveAlsoDebuff) {
      result |= removeBuffs(battler, numToRemove, false);
    }
    return result;
  };

  //
  // reset specified number of buffs/debuffs that affects the target
  //
  const buffToRemove = (states, num, isBuff) => {
    if (!num || num < 0) {
      return [];
    }
    const paramIds = [];
    for (let i = 0; i < states.length; i++) {
      if (isBuff ? states[i] > 0 : states[i] < 0) {
        paramIds.push(i);
        if (--num === 0) {
          break;
        }
      }
    }
    return paramIds;
  };

  const removeBuffs = (battler, num, isBuff) => {
    let result = false;
    const paramIds = buffToRemove(battler._buffs, num, isBuff);
    for (paramId of paramIds) {
      battler.removeBuff(paramId);
      result = true;
    }
    return result;
  };

})();
