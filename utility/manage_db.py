from datetime import timedelta

from pyapplication import app, db
from pyapplication.modules.user_model import User
from pyapplication.modules.clip_model import Clip
from pyapplication.modules.clipitem_model import ClipItem
from pyapplication.modules.cliplist_model import ClipItemList

def gen_sample():
    db.drop_all()
    db.create_all()

    testUser = User(alias='test')
    db.session.add(testUser)

    list1 = ClipItemList(title="Test List 1", user=testUser)
    list2 = ClipItemList(title="Test List 2", user=testUser)
    list3 = ClipItemList(title="Test List 3", user=testUser)
    list4 = ClipItemList(title="Test List 4", user=testUser)
    db.session.add(list1)
    db.session.add(list2)
    db.session.add(list3)
    db.session.add(list4)

    test_clip = Clip(audio_url="/audio/test.wav", sample_data='[]')
    db.session.add(test_clip)

    clips = []
    clips += [ClipItem(title="Test Item 1-1", clip_list=list1, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 1-2", clip_list=list1, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 1-3", clip_list=list1, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 1-4", clip_list=list1, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 1-5", clip_list=list1, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 1-6", clip_list=list1, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 2-1", clip_list=list2, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 2-2", clip_list=list2, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 2-3", clip_list=list2, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 2-4", clip_list=list2, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 3-1", clip_list=list3, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 4-1", clip_list=list4, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 4-2", clip_list=list4, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 4-3", clip_list=list4, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 4-4", clip_list=list4, clip=test_clip, data='[test]')]
    clips += [ClipItem(title="Test Item 4-5", clip_list=list4, clip=test_clip, data='[test]')]

    for clip in clips:
        db.session.add(clip)

    db.session.commit();

def gen_blank():
    db.drop_all();
    db.create_all();

    db.session.commit();
