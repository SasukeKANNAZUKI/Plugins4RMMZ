//=============================================================================
// Plugin for RPG Maker MV and MZ
// ChangeStateLuck.js
//=============================================================================
// [Update History]
// 2023/Dec/30 Ver.1.0.0 First Release
//

/*:
 * @target MV MZ
 * @plugindesc Change the luck effect of the skill or item to another formula.
 * @author Sasuke KANNAZUKI
 *
 * @param physicalFormula
 * @text Physical Formula
 * @desc Percentage Formula for State Rate of Physical Attack. Set Empty To Use Default Formula.
 * @type string
 * @default 100 + (a.luk - b.luk) * 0.1
 *
 * @param magicalFormula
 * @text Magical Formula
 * @desc Percentage Formula for State Rate of Magical Attack. Set Empty To Use Default Formula.
 * @type string
 * @default 100 + (a.luk - b.luk) * 0.1
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) and MZ.
 *
 * This plugin enables to replace the luck effect to the rate of 
 * an usable item(*1) to another formula.
 *
 * (*1) "usable item" is skill and item.
 *
 * [Summary]
 * By default, the luck parameter affects the percentage of state success rate
 * as following formula.
 * 100 + (a.luk - b.luk) * 0.1
 *
 * This plugin enables to change the formula for each Hit Type(*2),
 * that can set at plugin parameters.
 * If set a parameter empty string, it adopts default formula described above.
 *
 * (*2)Hit Type is Physical Attack, Magical Attack.
 * It cannot apply to Certain Hit.
 *
 * It can also set original formula to specified skill and item
 * by writing following notation to its note:
 *
 * <stateFormula:[Success Percentage Formula]>
 *
 * In this case, it adopts [Success Percentage Formula] as the formula.
 *
 * [[Examples of Formulae]]
 *
 * <stateFormula:100 + a.agi - b.agi>
 * In this case, the percentage is affected by both attacker
 * and target's agility.
 *
 * <stateFormula:100 + a.mat - b.mdf>
 * In this case, the percentage is affected by attacker's M.Attack
 * and target's M.Defense.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc 攻撃時の運によるステート付与率の変動式を変更
 * @author 神無月サスケ
 *
 * @param physicalFormula
 * @text 物理攻撃時ステート式
 * @desc 物理攻撃でステートを与える確率％。空欄にするとデフォルトの式になります。
 * @type string
 * @default 100 + (a.luk - b.luk) * 0.1
 *
 * @param magicalFormula
 * @text 魔法攻撃ステート式
 * @desc 魔法攻撃でステートを与える確率％。空欄にするとデフォルトの式になります。
 * @type string
 * @default 100 + (a.luk - b.luk) * 0.1
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 *
 * このプラグインは、攻撃時の運によるステート付与率を別の式に置き換えます。
 *
 * ■概要
 * デフォルトでは、運による確率の変動％に以下の式を採用しています。
 * 100 + (a.luk - b.luk) * 0.1
 *
 * このプラグインでは、命中タイプごとに、その式を置き換えられます。
 * 空欄にした場合は、デフォルトの式が採用されます。
 *
 * 注意：命中タイプが「必中」のスキルやアイテムについては設定できません。
 *
 * また、特定のスキルやアイテムに確率変動を設定する場合、
 * そのメモに、以下のように書きます。
 *
 * <stateFormula:[成功率％式]>
 *
 * [成功率％式]で記述された式を評価し、その数値の％で成功率を変動させます。
 *
 * ◆例：
 * <stateFormula:100 + a.agi - b.agi>
 * 攻撃側の敏捷性から、攻撃を受ける側の敏捷性を引き算した％になります。
 * <stateFormula:100 + a.mat - b.mdf>
 * 攻撃側の魔法力から、攻撃を受ける側の魔法防御力を引き算した％になります。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {

  const pluginName = 'ChangeStateLuck';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const physicalFormula = parameters['physicalFormula'];
  const magicalFormula = parameters['magicalFormula'];

  const rateFormula = action => {
    const originalFormula = action.item().meta.stateFormula;
    if (originalFormula) {
      return originalFormula;
    } else if (action.isPhysical() && physicalFormula) {
      return physicalFormula;
    } else if (action.isMagical() && magicalFormula) {
      return magicalFormula;
    }
    return null;
  };

  const stateRate = (action, target) => {
    const formula = rateFormula(action);
    if (formula) {
      const a = action.subject();
      const b = target;
      const v = $gameVariables._data;
      try {
        return +eval(formula);
      } catch (e) {
        console.error("Malformed Formula :" + item.name + " " + formula);
      }
    }
    return NaN;
  };

  const _Game_Action_lukEffectRate = Game_Action.prototype.lukEffectRate;
  Game_Action.prototype.lukEffectRate = function(target) {
    const rate = stateRate(this, target);
    if (isNaN(rate)) {
      // default formula: (100 + (a.luk - b.luk) * 0.1) / 100
      return _Game_Action_lukEffectRate.call(this, target);
    } else {
      return Math.max(rate / 100.0, 0.0);
    }
  };
})();
