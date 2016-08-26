from db import db
from sqlalchemy import desc


class Judgement(db.Model):
    __tablename__ = 'judgements'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    app_id = db.Column(db.Integer)
    rating = db.Column(db.String(6))
    judge_id = db.Column(db.Integer)
    judge_index = db.Column(db.Integer)

    @staticmethod
    def getLastRatedJudgementByJudgeID(judge_id):
        judgement = Judgement.query \
            .filter_by(judge_id=id, ) \
            .filter(Judgement.rating.isnot(None)) \
            .order_by(desc(Judgement.judge_index)) \
            .first()

        return judgement

    @staticmethod
    def getCurrentJudgementByJudgeId(judge_id):
        judgement = Judgement.query \
            .filter_by(judge_id=judge_id) \
            .filter(Judgement.rating.is_('')) \
            .order_by(desc(Judgement.judge_index)) \
            .first()

        return judgement
