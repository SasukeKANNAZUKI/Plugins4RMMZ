//=============================================================================
// MPP_TwoHandWeapon.js
//=============================================================================
// Copyright (c) 2015 Mokusei Penguin, 2023 Sasuke KANNAZUKI.
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

// [Update History]
// 2015.XXX.XX Ver1.0.0 First Release
// 2023.Nov.16 Ver1.1.0 Enables to run under also RMMZ,
//                      Adapt at the slot is locked.
// 2023.Nov.17 Ver1.2.0 Enables to lock first weapon,

/*:
 * @target MV MZ
 * @plugindesc 【ver.1.2.0】両手持ち武器を設定できます。
 * @author 神無月サスケ、木星ペンギン
 *
 * @help
 * このプラグインはRPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 *
 * 通常、装備タイプ「盾」を封印や固定しても
 * 二刀流時は武器を二つ持ててしまいます。
 *
 * そこで、装備タイプ「盾」を封印した場合、
 * 2番目のスロットを封印(装備不可に)するように変更します。
 *
 * 同様に、装備タイプ「盾」を固定した場合、
 * 2番目のスロットの武器を変更不可にします。
 *
 * また、装備タイプ「剣」を固定した場合、
 * 1番目のスロットの武器を変更不可にします。
 *
 * ■注意
 * 装備タイプ「武器」を封印した場合、
 * そのアクターは、武器を何も装備出来なくなります。
 *
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 *
 * 機能追加 : 神無月サスケ 
 */

(() => {

  //---------------------------------------------------------------------------
  // Game_Actor

  Game_Actor.prototype.isLockedSlot = function(slotId, equipType) {
    return slotId === 1 && this.isEquipTypeLocked(equipType);
  };

  Game_Actor.prototype.isSealedSlot = function(slotId, equipType) {
    return slotId === 1 && this.isEquipTypeSealed(equipType);
  };

  const _Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
  Game_Actor.prototype.isEquipChangeOk = function(slotId) {
    if (this.isLockedSlot(slotId, 2) || this.isSealedSlot(slotId, 2)) {
      return false;
    } else if (this.isLockedSlot(slotId, 1) || this.isSealedSlot(slotId, 1)) {
      return true;
    }
    return _Game_Actor_isEquipChangeOk.call(this, slotId);
  };

  const _Game_Actor_releaseUnequippableItems =
    Game_Actor.prototype.releaseUnequippableItems;
  Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
    _Game_Actor_releaseUnequippableItems.call(this, forcing);
    for (;;) {
      const equips = this.equips();
      let changed = false;
      for (let i = 0; i < equips.length; i++) {
        const item = equips[i];
        if (item && this.isSealedSlot(i, 2)) {
          if (!forcing) {
            this.tradeItemWithParty(null, item);
          }
          this._equips[i].setObject(null);
          changed = true;
        }
      }
      if (!changed) {
          break;
      }
    }
  };

})();
