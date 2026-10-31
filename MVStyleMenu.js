//=============================================================================
// Plugin for RPG Maker MZ
// MVStyleMenu.js
//=============================================================================
// [Update History]
// 2022.May.22 Ver1.0.0 First Release

/*:
 * @target MZ
 * @plugindesc change menu layout (especially gauge) to MV-like style
 * @author Sasuke KANNAZUKI
 *
 * @param doesDisplayNextLevel
 * @text Display Exp To Next Lv?
 * @desc Does display Exp To Next Lv beneath Lv?
 * @on Yes
 * @off No
 * @type boolean
 * @default true
 *
 * @param textNextLevel
 * @parent doesDisplayNextLevel
 * @text Term "Exp Next" (abbr.)
 * @desc the abbr. of "Exp Next". %1 is replaced Level(abbr.)
 * @type string
 * @default Next%1
 *
 * @param doesChangeAtBattle
 * @text Change Gauge On Battle?
 * @desc Change Gauge also on Battle? (If yes, it's not display TP)
 * @on Yes
 * @off No
 * @type boolean
 * @default false
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * This plugin change the default menu layout.
 * Especially, make HP/MP gauge like MV style.
 *
 * [Summary]
 * This plugin changes all HP/MP/TP gauges into MV style at any menu scene,
 * and enables to display exp to next level.
 * This change affects all of menu scene(sub class of Scene_MenuBase).
 *
 * [Note]
 * - This plugin is for default type menu. This doesn't available at changed
 *   layout (ex.introduce AltMenuScreen plugin)
 * - If it doesn't display TP, it can display MV-Like gauge also in battle
 *   (By option)
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc メニュー画面のレイアウト(ゲージなど)をMV風に変更します。
 * @author 神無月サスケ
 *
 * @param doesDisplayNextLevel
 * @text 必要EXP表示？
 * @desc 次のレベルまでの必要経験値を表示する？
 * @on する
 * @off しない
 * @type boolean
 * @default true
 *
 * @param textNextLevel
 * @parent doesDisplayNextLevel
 * @text 「必要EXP」用語
 * @desc 「次のレベルまでの必要経験値」を短縮した用語。%1は、レベル(略)に置き換えられます。
 * @type string
 * @default Next%1
 *
 * @param doesChangeAtBattle
 * @text 戦闘時ゲージ変更？
 * @desc 戦闘中でもゲージを変更するか？(この場合、TPは表示されません)
 * @on Yes
 * @off No
 * @type boolean
 * @default false
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、メニュー画面をMV風にします。
 *
 * ■概要
 * HP/MP/TPゲージを、MV風のHP/MPゲージに変更します。
 * この変更は、全てのメニュー画面に対して行われます。
 * また、次のレベルまでの必要経験値も表示可能です。
 *
 * 戦闘中はTP表示が必要の為、デフォルトのままですが、
 * TP表示が不要な場合は、オプションによってゲージを変更できます。
 *
 * ■注意
 * ・このプラグインは、デフォルトのメニュー専用です。
 *  プラグイン(AltMenuScreenなど)でレイアウトが変更された場合は無効です。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'MVStyleMenu';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const withNextLv = eval(parameters['doesDisplayNextLevel'] || 'true');
  const textNextLv = parameters['textNextLevel'] || 'Next%1';
  const alsoAtBattle = eval(parameters['doesChangeAtBattle'] || 'false');

  //
  // draw MV style Level
  //
  Window_StatusBase.prototype.drawActorLvlMV = function(actor, x, y, width) {
    width = width || 168;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(TextManager.levelA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.level, x, y, width, 'right');
  };

  //
  // draw exp to next level
  //
  const expNextValue = actor => {
    if (actor.isMaxLevel()) {
        return "------";
    } else {
        return actor.nextRequiredExp();
    }
  };

  Window_StatusBase.prototype.drawExpToNext = function(actor, x, y, width) {
    if (withNextLv) {
      width = width || 168;
      this.changeTextColor(ColorManager.systemColor());
      const text = textNextLv.format(TextManager.levelA);
      this.drawText(text, x, y, width, 'left');
      this.resetTextColor();
      this.drawText(expNextValue(actor), x, y, width, 'right');
    }
  };

  //
  // draw parameters and gauges for MV style
  //
  const _Window_StatusBase_placeBasicGauges =
   Window_StatusBase.prototype.placeBasicGauges;
  Window_StatusBase.prototype.placeBasicGauges = function(actor, x, y, width) {
    if (!$gameParty.inBattle() || alsoAtBattle) {
      width = width || ($gameParty.inBattle() ? 128 : 168);
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
    const color1 = ColorManager.hpGaugeColor1();
    const color2 = ColorManager.hpGaugeColor2();
    this.drawGaugeMV(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    const hpColor = ColorManager.hpColor(actor);
    const normalColor = ColorManager.normalColor();
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMaxMV(actor.hp, actor.mhp, x, y, width, hpColor,
      normalColor
    );
  };

  Window_StatusBase.prototype.drawActorMpMV = function(actor, x, y, width) {
    const color1 = ColorManager.mpGaugeColor1();
    const color2 = ColorManager.mpGaugeColor2();
    this.drawGaugeMV(x, y, width, actor.mpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    const mpColor = ColorManager.mpColor(actor);
    const normalColor = ColorManager.normalColor();
    this.drawText(TextManager.mpA, x, y, 44);
    this.drawCurrentAndMaxMV(actor.mp, actor.mmp, x, y, width, mpColor,
      normalColor
    );
  };

  Window_Base.prototype.drawGaugeMV = function(x, y, width, rate, c1, c2) {
    const fillW = Math.floor(width * rate);
    const gaugeY = y + this.lineHeight() - 8;
    const bgColor = ColorManager.gaugeBackColor();
    this.contents.fillRect(x, gaugeY, width, 6, bgColor);
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, c1, c2);
  };

  Window_Base.prototype.drawCurrentAndMaxMV = function(current, max, x, y,
   width, color1, color2) {
    const labelWidth = this.textWidth(
      Math.max(TextManager.hpA, TextManager.mpA)
    );
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

  //
  // display parameters as MV style
  //
  const needsDisplayIcon = actor => !!actor.allIcons().length;
  Window_StatusBase.prototype.drawActorSimpleStatus = function(actor, x, y) {
    const lineHeight = this.lineHeight();
    const x2 = x + 180;
    this.drawActorName(actor, x, y);
    this.drawActorLvlMV(actor, x, y + lineHeight * 1, 96);
    this.drawExpToNext(actor, x, y + lineHeight * 2, 160);
    if (withNextLv) {
      if(needsDisplayIcon(actor)) {
        this.drawActorIcons(actor, x2, y);
      } else {
        this.drawActorClass(actor, x2, y);
      }
    } else {
      this.drawActorIcons(actor, x, y + lineHeight * 2);
      this.drawActorClass(actor, x2, y);
    }
    this.placeBasicGauges(actor, x2, y + lineHeight, 168);
  };

  //
  // At battle scene, it needs to keep refreshing
  //
  const _Window_BattleStatus_update = Window_BattleStatus.prototype.update;
  Window_BattleStatus.prototype.update = function() {
    if (alsoAtBattle) {
      Window_StatusBase.prototype.update.call(this);
      this.preparePartyRefresh();
    } else {
      _Window_BattleStatus_update.call(this);
    }
  };

})();
