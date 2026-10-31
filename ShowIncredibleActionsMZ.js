//=============================================================================
// ShowIncredibleActionsMZ.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017 Tsumio
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version of ShowIncredibleActions.js
// 1.0.7 2017/07/28 行動回数1回のとき、ウィンドウの表示非表示を設定できるように変更。
// 1.0.6 2017/07/27 ウィンドウの幅とオフセットを設定できるように変更。
// 1.0.5 2017/07/26 キャンセル時の挙動を調整。
// 1.0.4 2017/07/26 フロントビューに対応。
// 1.0.3 2017/07/25 行動時に表示をなくすように変更。
// 1.0.2 2017/07/24 PT人数によってはエラーが出る不具合を修正。
// 1.0.1 2017/07/24 プラグインパラメーターを追加。表示方式を選べるように変更。
// 1.0.0 2017/07/23 公開。
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/Tsumio/rmmv-plugins
// [Blog]   : http://ntgame.wpblog.jp/
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================
// ShowIncredibleActionsMZ.js by Sasuke KANNAZUKI
// 1.0.0 2023/Nov/05 First Release for MZ
// 1.1.0 2024/Nov/11 Enables to display remain inputtable times
//

/*:
 * @target MZ
 * @plugindesc [Ver1.1.0]Displays the number of actions in battle scene.
 * @author Sasuke KANNAZUKI, Tsumio
 *
 * @param SideViewSettings
 * @text ----SideViewSettings----
 * @desc 
 * @default 
 * 
 * @param DisplayType
 * @parent SideViewSettings
 * @type select
 * @option Inputtable Number
 * @value InputtableNumber
 * @option Number
 * @option Exclamation
 * @desc This is a setting sets displaying type.You can set 'Number', 'InputtableNumber' or 'Exclamation'
 * @default InputtableNumber
 * 
 * @param StringColor
 * @parent SideViewSettings
 * @type string
 * @desc This is a setting sets the number(or exclamation) color.You can use two type.The thing is 'string' type and 'CSS format' type.
 * @default #FFF
 * 
 * @param OffSetX
 * @parent SideViewSettings
 * @type number
 * @min -10000
 * @max 10000
 * @desc This is a setting sets the offset of X position.
 * @default 60
 * 
 * @param OffSetY
 * @parent SideViewSettings
 * @type number
 * @min -10000
 * @max 10000
 * @desc This is a setting sets the offset of Y position.
 * @default -20
 * 
 * @param FrontViewSettings
 * @text ----FrontViewSettings----
 * @desc 
 * @default 
 * 
 * @param AdvanceString
 * @parent FrontViewSettings
 * @type string
 * @desc Specify a character string that announces the number of actions.
 * @default Number of actions :
 * 
 * @param ShowName
 * @parent FrontViewSettings
 * @type boolean
 * @desc Whether to display the name before the 'AdvanceString'.
 * @default true
 * 
 * @param HideWindow
 * @parent FrontViewSettings
 * @type boolean
 * @desc Whether to hide the window when the number of actions is 1.
 * @default false
 *
 * @param WindowWidth
 * @parent FrontViewSettings
 * @type number
 * @max 20000
 * @desc This is a setting sets the width of the window for displaying the number of actions.
 * @default 400
 *  
 * @param OffSetX_FV
 * @parent FrontViewSettings
 * @type number
 * @min -10000
 * @max 10000
 * @desc This is a setting sets the offset of Window X position.
 * @default 0
 * 
 * @param OffSetY_FV
 * @parent FrontViewSettings
 * @type number
 * @min -10000
 * @max 10000
 * @desc This is a setting sets the offset of Window Y position.
 * @default 0
 * 
 * @help
 * This plugin runs under RPG Maker MZ.
 *
 * If there is a character that can act more than once when battle scene,
 * the number of times that the action can be taken is displayed.
 * 
 * ----how to use----
 * You can use this plugin just by adding.
 * 
 * If you use side view ,you can select the display type from "Number" or
 * "Exclamation".
 * If you use front view , only "Number" can be used.
 * 
 * The reference coordinates of the window in front view are
 * the coordinates of the command window.
 * 
 * ----plugin command----
 * There is no plugin command.
 *
 * --Terms of Use--
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 * This plugin is free for both commercial and non-commercial use.
 * You don't have to make sure to credit.
 * Furthermore, you may edit the source code to suit your needs,
 * so long as you don't claim the source code belongs to you.
 * 
 */
/*:ja
 * @target MZ
 * @plugindesc [Ver1.1.0]戦闘時に行動可能回数を表示
 * @author 神無月サスケ、ツミオ
 * 
 * @param SideViewSettings
 * @text  ----サイドビューの設定----
 * @desc 
 * @default 
 * 
 * @param DisplayType
 * @text 表示方式
 * @parent SideViewSettings
 * @type select
 * @option 残り入力可能ターン数
 * @value InputtableNumber
 * @option 行動可能ターン数
 * @value Number
 * @option エクスクラメーション
 * @value Exclamation
 * @desc 表示方式を設定します。
 * @default InputtableNumber
 * 
 * @param StringColor
 * @text 文字色
 * @parent SideViewSettings
 * @type string
 * @desc 文字色の色を設定します。直接文字を指定することもできますが、CSS形式でより細かい指定もできます。
 * @default #FFF
 * 
 * @param OffSetX
 * @text X座標のオフセット
 * @parent SideViewSettings
 * @type number
 * @min -10000
 * @max 10000
 * @desc X座標のオフセットを設定します。
 * @default 60
 * 
 * @param OffSetY
 * @text Y座標のオフセット
 * @parent SideViewSettings
 * @type number
 * @min -10000
 * @max 10000
 * @desc Y座標のオフセットを設定します。
 * @default -20
 * 
 * @param FrontViewSettings
 * @text ----フロントビューの設定----
 * @desc 
 * @default
 * 
 * @param AdvanceString
 * @text アナウンス文字
 * @parent FrontViewSettings
 * @type string
 * @desc 行動回数をアナウンスする文字列を指定します。
 * @default の行動回数：
 * 
 * @param ShowName
 * @text 名前の表示
 * @parent FrontViewSettings
 * @type boolean
 * @desc アナウンス文字の前に名前を表示するかどうか。
 * @default true
 * 
 * @param HideWindow
 * @text ウィンドウの非表示
 * @parent FrontViewSettings
 * @type boolean
 * @desc 行動回数1回のとき、ウィンドウを非表示にするかどうか。
 * @default false
 * 
 * @param WindowWidth
 * @text ウィンドウの幅
 * @parent FrontViewSettings
 * @type number
 * @max 20000
 * @desc 行動回数を表示するウィンドウの幅を設定します。
 * @default 400
 * 
 * @param OffSetX_FV
 * @text X座標のオフセット
 * @parent FrontViewSettings
 * @type number
 * @min -10000
 * @max 10000
 * @desc ウィンドウのX座標のオフセットを設定します。
 * @default 0
 * 
 * @param OffSetY_FV
 * @text Y座標のオフセット
 * @parent FrontViewSettings
 * @type number
 * @min -10000
 * @max 10000
 * @desc ウィンドウのY座標のオフセットを設定します。
 * @default 0
 * 
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * 戦闘時、複数回行動可能なキャラクターがいた場合、
 * その行動可能回数を表示します。
 * 
 * 【使用方法】
 * プラグインを導入するだけで使用できます。
 * 
 * サイドビューの場合、表示方式は「数字」か「エクスクラメーション」の
 * 2種類から選ぶことができます。
 * フロントビューは数字のみに対応しています。
 * 
 * フロントビュー時のウィンドウの基準座標は、
 * コマンドウィンドウの座標になっています。
 * 
 * 【プラグインコマンド】
 * このプラグインにプラグインコマンドはありません。
 *
 * 【備考】
 * 当プラグインを利用したことによるいかなる損害に対しても、
 * 制作者は一切の責任を負わないこととします。
 * 
 * 【利用規約】
 * このプラグインは MIT ライセンスで配布されます。
 * http://opensource.org/licenses/mit-license.php
 * ソースコードの著作権者が自分であると主張しない限り、
 * 作者に無断で改変、再配布が可能です。
 * 利用形態（商用、18禁利用等）についても制限はありません。
 * 自由に使用してください。
 * 
 */

(() => {
    'use strict';
    const pluginName = 'ShowIncredibleActionsMZ';

    //Declare NTMO namespace.
    window.NTMO = window.NTMO || {};

    //========================================================================
    // Get and set pluguin parameters.
    //========================================================================
    const param             = {};
    const parameters = PluginManager.parameters(pluginName);
    //Side view
    param.offsetX         = Number(parameters['OffSetX']) || 0;
    param.offsetY         = Number(parameters['OffSetY']) || 0;
    param.displayType     = parameters['DisplayType'] || "";
    param.textColor       = parameters['StringColor'] || '#F00';
    //Front view
    param.advanceString   = parameters['AdvanceString'] || "";
    param.isShowName      = !!JSON.parse(parameters['ShowName']);
    param.offsetX_FV      = Number(parameters['OffSetX_FV']) || 0;
    param.offsetY_FV      = Number(parameters['OffSetY_FV']) || 0;
    param.windowWidth     = Number(parameters['WindowWidth']) || 600;
    param.hideWindow      = !!JSON.parse(parameters['HideWindow']);
    
    //========================================================================
    // Scene_Battle
    //  Override Scene_Battle for displayng number of actions.
    //========================================================================

    //
    // create window for front view
    //
    const _Scene_Battle_createAllWindows =
      Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
      _Scene_Battle_createAllWindows.call(this);
      this.createNumActionsWindow();
    };

    const numActionWindowRect = (height, y) => {
      const x = 0 + param.offsetX_FV;
      const y2 = y + param.offsetY_FV;
      const width = param.windowWidth;
      return new Rectangle(x, y2, width, height);
    };

    Scene_Battle.prototype.createNumActionsWindow = function() {
      if(!$gameSystem.isSideView()){
        const height  = 70;
        const y = this._partyCommandWindow.y - height;
        this._window_numActions = new Window_NumActions(
          numActionWindowRect(height, y)
        );
        this.addWindow(this._window_numActions);
      }
    };

    const _Scene_Battle_startPartyCommandSelection =
      Scene_Battle.prototype.startPartyCommandSelection;
    Scene_Battle.prototype.startPartyCommandSelection = function() {
      _Scene_Battle_startPartyCommandSelection.call(this);
      if (!$gameSystem.isSideView()) {
        this._window_numActions.hide();
      }
    };

    //
    // find number to display
    //
    const doesDisplayNumber = () => {
      return ["Number", "InputtableNumber"].contains(param.displayType);
    };

    const numberToDisplay = actor => {
      const numActions = actor.numActions();
      if (param.displayType === "InputtableNumber") {
        return actor.isWaiting() ? 0 : numActions - actor._actionInputIndex;
      } else {
        return numActions > 1 ? numActions : 0;
      }
    };

    //
    // setting sprites for side view
    //
    const _Scene_Battle_createDisplayObjects =
      Scene_Battle.prototype.createDisplayObjects;
    Scene_Battle.prototype.createDisplayObjects = function() {
      _Scene_Battle_createDisplayObjects.call(this);
      this.createNumberOfActions();
    };

    const popupFontSize = () => $gameSystem.mainFontSize() + 4;

    Scene_Battle.prototype.createNumberOfActions = function() {
      if ($gameSystem.isSideView()) {
        this.sprite_numberOfActions = new Sprite();
        this.sprite_numberOfActions.bitmap = new Bitmap(
          Graphics.width, Graphics.height
        );
        this.sprite_numberOfActions.bitmap.fontSize = popupFontSize();
        this.sprite_numberOfActions.bitmap.textColor = param.textColor;
        this.addChild(this.sprite_numberOfActions);
      }
    };

    Scene_Battle.prototype.updateIncredibleActions = function() {
      if ($gameSystem.isSideView()) {
        this.sprite_numberOfActions.bitmap.clear();
        const p_len = this._spriteset._actorSprites.length;
        const p_obj = this._spriteset._actorSprites;
        const offset = -40;
        for(let i = 0; i < p_len; i++){
          //This code is necessary to avoid an error.
          if (p_obj[i]._actor == null) {
            continue;
          }
          const number = numberToDisplay(p_obj[i]._actor);
          if (number > 0){
            this.sprite_numberOfActions.bitmap.drawText(
            doesDisplayNumber() ? number : '!',
            p_obj[i].x + offset + param.offsetX,
            p_obj[i].y + offset + param.offsetY,
            this.sprite_numberOfActions.width, 32, "left");
          }
        }
      }
    };

    //
    // show and hide window and popup sprites
    //
    const _Scene_Battle_startActorCommandSelection =
      Scene_Battle.prototype.startActorCommandSelection;
    Scene_Battle.prototype.startActorCommandSelection = function() {
      _Scene_Battle_startActorCommandSelection.call(this);
      if ($gameSystem.isSideView()) {
        this.updateIncredibleActions();
        this.sprite_numberOfActions.show();
      } else {
        this._window_numActions.show();
        const actor = BattleManager.actor();
        this._window_numActions.drawNumAction(actor);
      }
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
      _Scene_Battle_update.call(this);
      if ($gameSystem.isSideView() && this.sprite_numberOfActions.visible) {
        this.updateIncredibleActions();
      }
    };

    const _Scene_Battle_endCommandSelection =
      Scene_Battle.prototype.endCommandSelection;
    Scene_Battle.prototype.endCommandSelection = function() {
      _Scene_Battle_endCommandSelection.call(this);
      if ($gameSystem.isSideView()) {
        this.sprite_numberOfActions.hide();
        this.sprite_numberOfActions.bitmap.clear();
      } else {
        this._window_numActions.hide();
      }
    };

    //========================================================================
    // Window_NumActions
    //  Original Window class for Scene_Battle.
    //========================================================================
    function Window_NumActions() {
        this.initialize(...arguments);
    }

    Window_NumActions.prototype = Object.create(Window_Base.prototype);
    Window_NumActions.prototype.constructor = Window_NumActions;

    Window_NumActions.prototype.initialize = function(x, y, width, height) {
      Window_Base.prototype.initialize.apply(this,arguments);
      this.hide();
      this.drawNumAction();
    };

    Window_NumActions.prototype.drawNumAction = function(actor) {
    if (!actor) {
      this.contents.clear();
      return;
    }
    const name = actor._name;
    const numActions = numberToDisplay(actor);
      if (param.hideWindow && numActions === 0) {
        this.contents.clear();
        this.hide();
        return;
      }
      if (!param.isShowName) {
          name = '';
      }
      this.show();
      this.contents.clear();
      this.drawTextEx(name + param.advanceString + numActions, 0, 0);
    };

})();