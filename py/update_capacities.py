import sys
import json
import collections
import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials

titles = ['スライム', 'DNAストラップ', 'くるくるマグネット', 'ふしぎな水そう', '球体ロボットでプログラミング体験', '電卓を分解して自分だけのアクセサリーを作ろう']
schedules = ['10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']

cred = credentials.Certificate('py/credentials.json')
firebase_admin.initialize_app(cred)
db = firestore.client()


# collectionの取得
def fetch_ref(collection):
    return db.collection(collection)


# 事前予約者の空いた枠を当日予約に引き継ぐ
def merge_applicants():
    adv_root_ref = fetch_ref('adv-capacities')
    door_root_ref = fetch_ref('door-capacities')
    for title in titles:        
        door_capacities = {
            '10:30': 0,
            '11:00': 0,
            '11:30': 0,
            '12:00': 2,
            '12:30': 2,
            '13:00': 2,
            '13:30': 2,
            '14:00': 2,
            '14:30': 2,
            '15:00': 2,
            '15:30': 2,
            '16:00': 2
        }

        adv_ref = adv_root_ref.document(title)
        adv_capacities = adv_ref.get().to_dict()
        
        # 午前の3つは除く
        for schedule in schedules[3:]:
            door_capacities[schedule] += adv_capacities[schedule]

        door_ref = door_root_ref.document(title)
        door_ref.set(door_capacities)


# 終了したコースを締め切る
def clear_capacities(schedule):
    root_ref = fetch_ref('door-capacities')
    for title in titles:
        capacities_ref = root_ref.document(title)
        capacities = capacities_ref.get().to_dict()
        capacities[schedule] = 0

        capacities_ref.update(capacities)


def main():
    # merge_applicants()
    clear_capacities('16:00')


if __name__ == '__main__':
    main()