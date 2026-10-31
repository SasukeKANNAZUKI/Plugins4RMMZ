//=============================================================================
// Plugin for RPG Maker MZ
// AllAbsorbWeapon.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 攻撃で与えたダメージをパーティ全員が吸収する武器を作成します。
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、攻撃時、与えたダメージと同様のHPを全員が回復する武器を
 * 作成可能にします。
 *
 * ■概要
 * 武器のメモ欄に、以下のように書くことで、その武器は、全体吸収武器になります。
 * <AbsorbAll>
 *
 * ■注意
 * タイプは「HPダメージ」にしてください。「HP吸収」にすると、二重に回復します。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {

  const doesAbsorbAll = a => a && a.weapons().some(w => w.meta.AbsorbAll);

  const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
  Game_Action.prototype.executeHpDamage = function(target, value) {
    if (target.isEnemy() && this.subject().isActor() && this.isAttack() &&
      doesAbsorbAll(this.subject())
    ) {
      for (const actor of $gameParty.members()) {
        actor.gainHp(value);
      };
    }
    _Game_Action_executeHpDamage.call(this, target, value);
  };

  const _Window_BattleLog_popupDamage =
   Window_BattleLog.prototype.popupDamage;
  Window_BattleLog.prototype.popupDamage = function(target) {
    if (target.isActor() && doesAbsorbAll(target)) {
      for (const actor of $gameParty.members()) {
        _Window_BattleLog_popupDamage.call(this, actor);
      }
      return;
    }
    _Window_BattleLog_popupDamage.call(this, target);
  };

})();
