//=============================================================================
// Plugin for RPG Maker MZ
// IgnoreBuffAttacker.js
//=============================================================================
// [Update History]
// 2024/Oct/21 Ver1.0.0 First Release
//

/*:
 * @target MZ
 * @plugindesc Attack Ignoring Target's Buff/Debuff
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * This plugin enables to set battlers that ignore target's buff and/or debuff.
 *
 * [How To Set]
 * Describe following notation at battler's(*1) note.
 * (*1) Actor, Enemy, Class, Weapon, Armor, State
 *
 * <IgnoreBuff> : Attack ignoring target's buff
 * <IgnoreDebuff> : Attack ignoring target's debuff
 * <IgnoreBuffDebuff> : Attack ignoring target's both buff and/or debuff
 *
 * [NOTE]
 * Be sure that the note is set by the attacker, not the one being attacked.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 対象の強化弱体を無視して攻撃
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、対象の強化弱体を無視したバトラーを作成可能にします。
 *
 * ■設定方法
 * アクターなど(*1)のメモに以下のように記述します。
 * (*1)アクター、敵キャラ、職業、武器、防具、ステート
 *
 * <IgnoreBuffDebuff> : 攻撃を受ける側の、強化/弱体両方を無視
 * <IgnoreBuff> : 強化を無視
 * <IgnoreDebuff> : 弱体を無視
 *
 * ■注意
 * メモを設定するのは、攻撃を受ける側ではなく、攻撃を行う側です。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'IgnoreBuffAttacker';

  //
  // Ignore buff and debuff when the condition is met.
  //
  Game_BattlerBase.prototype.doesIgnoreBuffs = function(paramId) {
    const objects = this.traitObjects();
    for (const object of objects) {
      if (this.buff(paramId) !== 0 && object.meta.IgnoreBuffDebuff) {
        return true;
      } else if (this.buff(paramId) > 0 && object.meta.IgnoreBuff) {
        return true;
      } else if (this.buff(paramId) < 0 && object.meta.IgnoreDebuff) {
        return true;
      }
    }
    return false;
  };

  const lastSubject = battler => {
    if (battler.isActor()) {
      return $gameTroop.members()[$gameTemp.lastActionData(3) - 1];
    } else {
      return $gameActors.actor($gameTemp.lastActionData(2));
    }
  };

  const _Game_BattlerBase_paramBuffRate =
    Game_BattlerBase.prototype.paramBuffRate;
  Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    if ($gameParty.inBattle()) {
      const subject = lastSubject(this);
      if (subject && subject.doesIgnoreBuffs(paramId)) {
        return 1.0;
      }
    }
    return _Game_BattlerBase_paramBuffRate.call(this, paramId);
  };
})();
