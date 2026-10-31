//=============================================================================
// Plugin for RPG Maker MZ
// NoRequiredWeapon.js
//=============================================================================
// [Update History]
// 2024.Aug.29 Ver1.0.0 First Release
//

/*:
 * @target MZ
 * @plugindesc Enables to remove constraint of 'required weapon' of skills
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 *
 * This plugin enables to make the state that remove the constraint of
 * 'required weapon' of skills.
 *
 * [Summary]
 * Write down following tag at the any object that can set the trait(*1).
 * ((*1)state, weapon, armor, class and actor)
 *
 * <NoRequiredWeapon>
 *
 * Then the actor can use any skills that set 'required weapon'
 * regardless of whether the actor equips the required weapon or not.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 「必要装備」に関係なくスキルを使用可能に
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインは、スキルの「必要装備」を装備しているかどうかにかかわらず
 * そのスキルを使用可能に設定できます。
 *
 * ■概要
 * ステートなど(*1)のメモに、以下のタグを書いて下さい。
 * ((*1)ステート、武器、防具、職業、アクター)
 *
 * <NoRequiredWeapon>
 *
 * このようなステートの時や、装備をしている間、スキルの「必要装備」を無視し、
 * 使用可能になります。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  Game_Actor.prototype.noRequiredWeapon = function() {
    return this.traitObjects().some(obj => obj.meta.NoRequiredWeapon);
  };

  const _Game_Actor_isSkillWtypeOk = Game_Actor.prototype.isSkillWtypeOk;
  Game_Actor.prototype.isSkillWtypeOk = function(skill) {
    if (this.noRequiredWeapon()) {
      return true;
    }
    return _Game_Actor_isSkillWtypeOk.call(this, skill);
  };
})();
