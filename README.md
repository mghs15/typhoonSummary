# typhoonSummary
台風の経路・中心気圧、接近・上陸等した対象都市の降水量・風速・潮位を時系列で把握できるように整理する。

**データの精査等は行っておりません。本レポジトリ・ページの利用により生じた損失及び損害等について、当方はいかなる責任も負わないものとします。**

とりあえず、以下の3台風を整理。
* 令和元年台風19号
  * https://mghs15.github.io/typhoonSummary/?data=2019T19&style=mono2
* 令和2年台風10号
  * https://mghs15.github.io/typhoonSummary/?data=2020T10&style=mono2
* 令和4年台風14号
  * https://mghs15.github.io/typhoonSummary/?data=2022T14&style=mono2

## データの収集と加工
### 台風の経路

気象庁の「台風位置表」で得られるデータから作成する。
https://www.data.jma.go.jp/yoho/typhoon/position_table/index.html

1. 目的の台風の位置表 PDF ファイルを開く。
2. ファイル全体をコピーして、テキストファイルにペースト。
3. テキストファイルを src フォルダに `tide.txt` として格納。
4. `route.js` で GeoJSON へ変換。結果は dat フォルダへ出力される。

参考：https://github.com/mghs15/stolytelling-R1-T19-arage#tools

### 降水量・風速

気象庁の「過去の気象データ検索」で得られるデータから作成する。
https://www.data.jma.go.jp/obd/stats/etrn/index.php

1. 表示地点、年、月、日を指定。
2. 「YYYY年MM月DD日の１時間ごとの値を表示」をクリック。
3. 表示された表をヘッダを除いてコピーして、テキストファイルにペースト（タブ区切りでペーストできる）。
4. 年、月、日、場所の4カラムを手動で列の先頭に追加。
5. 必要な日付分繰り返して一つのファイルにまとめて、src フォルダに `dataset.csv` として格納。
6. `dataset.js` で chart.js に渡せるような JSON へ変換。結果は dat フォルダへ出力される。

### 潮位

気象庁の「潮汐観測資料」で得られるデータから作成する。
https://www.data.jma.go.jp/gmd/kaiyou/db/tide/genbo/index.php

1. 表示地点、表示年月を指定。
2. 毎時潮位にチェックを入れて、「各項目を入力してクリック」を押す。
3. 表示された表をヘッダを除いてコピペして、テキストファイルにペースト（タブ区切りでペーストできる）。
4. 場所、年、月の3カラムを手動で列の先頭に追加して、src フォルダに `tide.txt` として格納。
5. `tide.js` で chart.js に渡せるような JSON へ変換。結果は dat フォルダへ出力される。

## データの統合

1. `combine.js` で dat フォルダ内の各データを統合し、Web サイト用のデータとする。結果は docs フォルダへ出力される。

## データの表示
* 台風の経路は 地図上へ表示。Web 地図ライブラリは Mapbox GL JS、地図データは国土地理院最適化ベクトルタイルを利用。
* グラフは Chart.js を利用して、時系列が合うように各グラフを並べる。
  * グラフを並べる関係上、グラフの描画範囲（軸の目盛りの数値や軸の名称を除いた領域）の大きさを揃えたかったが、そのような方法が見つからず。軸の目盛りの桁数によって、グラフ描画範囲がずれてしまうため、適当な文字（"=" 等）で埋めて、桁数をそろえることでお茶を濁す。

## 参考文献
* 気象庁HP
  * 台風位置表 https://www.data.jma.go.jp/yoho/typhoon/position_table/index.html
  * 過去の気象データ検索 https://www.data.jma.go.jp/obd/stats/etrn/index.php
  * 潮汐観測資料 https://www.data.jma.go.jp/gmd/kaiyou/db/tide/genbo/index.php
* 国土地理院 最適化ベクトルタイル https://github.com/gsi-cyberjapan/optimal_bvmap
* Mapbox GL JS https://github.com/mapbox/mapbox-gl-js
* Chart.js https://www.chartjs.org/
  * chartjs-adapter-moment https://github.com/chartjs/chartjs-adapter-moment
* https://mat0401.info/blog/chartjs-timeline/
