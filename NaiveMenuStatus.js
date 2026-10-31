//=============================================================================
// Plugin for RPG Maker MZ
// NaiveMenuStatus.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Display HP/MP on Menu Very Simple
 * @author Sasuke KANNAZUKI
 *
 * @orderBefore NaiveBattleStatus
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 *
 * This plugin changes the view of HP and MP into very simple.
 *
 * [Summary]
 * It displays current and max HP and MP, with no gauge.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc メニュー画面のHP/MP表示をシンプルにします
 * @author 神無月サスケ
 *
 * @orderBefore NaiveBattleStatus
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインは、メニュー画面でのHP/MP表示を非常にシンプルにします。
 *
 * ■概要
 * このプラグインでは、HP/MPの現在値と最大値を表示しますが、
 * ゲージは表示しません。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'NaiveMenuStatus';
  //
  // draw parameters for MV-like style(without gauge)
  //
  const _Window_StatusBase_placeBasicGauges =
   Window_StatusBase.prototype.placeBasicGauges;
  Window_StatusBase.prototype.placeBasicGauges = function(actor, x, y, width) {
    if (!$gameParty.inBattle()) {
      width = width || 168;
      this.drawGaugesMV(actor, x, y, width);
    }
    else {
      _Window_StatusBase_placeBasicGauges.call(this, actor, x, y, width);
    }
  };

  Window_StatusBase.prototype.drawGaugesMV = function(actor, x, y, width) {
    const lineHeight = this.lineHeight();
    this.drawActorHpMV(actor, x, y + lineHeight * 0, width);
    this.drawActorMpMV(actor, x, y + lineHeight * 1, width);
  };

  Window_StatusBase.prototype.drawActorHpMV = function(actor, x, y, width) {
    const hpColor = ColorManager.hpColor(actor);
    const normalColor = ColorManager.normalColor();
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMaxMV(actor.hp, actor.mhp, x, y, width, hpColor,
      normalColor
    );
  };

  Window_StatusBase.prototype.drawActorMpMV = function(actor, x, y, width) {
    const mpColor = ColorManager.mpColor(actor);
    const normalColor = ColorManager.normalColor();
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y, 44);
    this.drawCurrentAndMaxMV(actor.mp, actor.mmp, x, y, width, mpColor,
      normalColor
    );
  };

  Window_Base.prototype.drawCurrentAndMaxMV = function(current, max, x, y,
   width, color1, color2) {
    const labelWidth = this.textWidth(TextManager.hpA);
    const valueWidth = this.textWidth('0000');
    const slashWidth = this.textWidth('/');
    const x1 = x + width - valueWidth;
    const x2 = x1 - slashWidth;
    const x3 = x2 - valueWidth;
    if (x3 >= x + labelWidth) {
        this.changeTextColor(color1);
        this.drawText(current, x3, y, valueWidth, 'right');
        this.changeTextColor(color2);
        this.drawText('/', x2, y, slashWidth, 'right');
        this.drawText(max, x1, y, valueWidth, 'right');
    } else {
        this.changeTextColor(color1);
        this.drawText(current, x1, y, valueWidth, 'right');
    }
  };

})();
