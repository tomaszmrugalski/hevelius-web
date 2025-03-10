# Old iTeleskop.org queries

## Total exposure time

```sql
select	details.*, total.*, details.suma_Czasu/total.suma_czasu, details.ile_zadan/total.ile_zadan
from
(
select  u.lastname,
                u.login,
        sum(t.exposure) as suma_czasu,
        count(1) as ile_zadan
  from tasks t
  join users u on u.user_id = t.user_id
 where state in (4,5,6)
 and performed between '2018-02-08 12:00:01' and '2019-03-05 12:00:00'
group by u.lastname, u.login
) as details,
(
select  sum(t.exposure) as suma_czasu,
        count(1) as ile_zadan
  from tasks t
 where state in (4,5,6)
 and performed between '2018-02-08 12:00:01' and '2019-03-05 12:00:00'
) as total

order by 3 desc ,4 desc
```

## Total exposure time per user

```sql
select	details.*,-- total.*,
                round(100*details.suma_Czasu/total.suma_czasu,2) as perc_czas,
        round(100*details.ile_zadan/total.ile_zadan,2) as perc_zadan,
                round(100*details.share/shares.total_share,2) as perc_share
from
        (select u.lastname,
                        u.login,
                        u.share,
                        sum(t.exposure) as suma_czasu,
                        count(1) as ile_zadan
           from tasks t
           join users u on u.user_id = t.user_id
          where state in (4,5,6)
                and performed between '2018-02-08 12:00:01' and '2019-03-05 12:00:00'
          group by u.lastname, u.login , u.share
        ) as details,
        (select sum(t.exposure) as suma_czasu,
                        count(1) as ile_zadan
           from tasks t
          where state in (4,5,6)
                and performed between '2018-02-08 12:00:01' and '2019-03-05 12:00:00'
        ) as total ,
        (select sum(share) as total_share
           from users
        ) shares
order by perc_czas desc

## Shares per user

```sql
select u.user_id, u.lastname, u.share, u.share/t.total_share as perc_share
from
(select sum(share) as total_share
  from users
 ) as t
 cross join users u
order by 3 desc
 ;
```
