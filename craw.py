import bs4
import requests
from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import datetime
import xlsxwriter
import time
import json
import random

from pymongo import MongoClient
import time
import datetime



connect = MongoClient('localhost', 27017)
db = connect.get_database('science_direct')
collection = db.crawler

_dict = {}

def contactInfo(f,body,n):
    authors = []
    affs = []
    counter = body.findAll("a",{"class":"author size-m workspace-trigger"})
    emails = body.find("script" ,{"type":"application/json"})
    data = json.loads(emails.text) #a dictionary!
    content = data.get('authors').get('content')
    for i in range(0, len(content)):
        card = content[i].get('$$')
        fucker = json.dumps(card,indent=3)
        # print(fucker)
        for j in range(0, len(counter)):
            outer = card[j].get('$$')
            outer2 = json.dumps(outer,indent=3)
            # print(outer2)    
            try: 
                name = outer[0].get("_")
                surname = outer[1].get("_")
                realname = name + " " + surname
            except Exception as e:
                # print("Cannot get name")
                realname = "Cannot get name"
            # print("Name : " + realname)
            if(len(outer) > 2):
                try:
                    email = outer[len(outer)-1].get("_")
                    # print("Email : " + email)
                except Exception as e:
                    print("Cannot get email")
            else:
                email = "None"
                # print("Email : " + email)
            try:
                temp = outer[2].get("$$")
                id = temp[0].get("_")
                # print("id : " + id)
            except Exception as e:
                id = "not-match"
                # print("Id : " + id)
                # print("Exception : " + str(e))
            authors.append({"name" : realname,"email" : email, "id" : id})
            _dict['author'] = authors   
            # print("---------------------------------------------------------------")
        # print("*****************************************************************************************")
        for j in range(len(counter), len(card)-1):
            try:
                outer = card[j].get('$$')
                outer2 = json.dumps(outer, indent=3)
                # print(outer2)
                if(len(outer) == 2):
                    affi = outer[0].get("_")
                    temp = outer[1].get("$$")
                    country = temp[len(temp)-1].get("_")
                    # print("Affiliation : " + affi)
                    # print("Country : " + country)
                elif(len(outer) > 2):
                    try:
                        # print("First way")
                        id = outer[0].get("_")
                        affi = outer[1].get("_")
                        temp = outer[2].get("$$")
                        country = temp[len(temp)-1].get("_")
                    except:
                        # print("Second way")
                        id = outer[0].get("_")
                        temp = outer[1].get("$$")
                        affi = temp[0].get("_")
                        temp2 = outer[2].get("$$")
                        country = temp[len(temp)-1].get("_")
                    # print("Id : " + id)
                    # print("Affiliation : " + str(affi))
                    # print("Country : " + country)
                    if str(affi).lower() == 'none':
                        temp = outer[1].get("$$")
                        affi = temp[0].get("_")
                    # print("---------------------------------------------------------------")
                elif(len(outer) < 2):
                    print("Oh my god you are so cool")
                affs.append({"affi" : affi , "country" : country , "id" : id })
                # _dict['author'] = authors   

            except Exception as e:
                print("Exception !: " + str(e))    
        # print("================================================================")
    for ele in authors:
        check = True
        arr_affs = []
        for ele2 in affs:
            if(ele['id'] == ele2['id']):
                check = False
                # print(ele2['affi'])
                _dict['name'] = ele['name']
                _dict['email'] = ele['email']
                _dict['affi'] = ele2['affi']
                _dict['country'] = ele2['country']
                n += 1
        if(check):
            # print(ele)
            _dict['name'] = ele['name']            
            _dict['email'] = ele['email']
            _dict['affi'] = 'Cannot get affiliation'
            _dict['country'] = 'Cannot get country'
            n += 1
    return n

# def init(f,input):
#     now = datetime.datetime.now()
#     f.write('A1', 'Keyword : ')
#     f.write('B1', input)
#     f.write('A2', 'Database : ')
#     f.write('B2', 'https://www.sciencedirect.com/')
#     f.write('A3', 'Date : ')
#     f.write('B3', str(now.isoformat()))
#     f.write('A4' , 'S.No')
#     f.write('B4' , 'Website')
#     f.write('C4' , 'Title')
#     f.write('D4' , 'Journal name')
#     f.write('E4' , 'Volume and date')
#     f.write('F4' , 'Keywords')
#     f.write('G4' , 'Doi number')
#     f.write('H4' , 'Author name')
#     f.write('I4' , 'Email')
#     f.write('K4' , 'Affiliation')
#     f.write('L4' , 'Country')

def crawling(input,f,first,last):
    n = 5
    count = 1
    values = [5,30,35,40,45,50,55,60,120]
    input = input.replace("&offset=0","")
    for i in range( int(first) - 1 , int(last)):
        try:
            headers = {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'}
            breaker = False
            my_url = input + '&offset=' + str(i*25)
            response = requests.get(my_url, headers=headers)
            page = soup(response.content, "html.parser")
            body = page.findAll("a",{"class":"result-list-title-link u-font-serif text-s"})
            stop = body[0].text
            links = []
            checker = []
            # print("enter SD : " + str(i*25))
            # print("URL : " + my_url)
            # print("------------------------------------------------------------------------")
            for each in body:
                links.append(each['href'])
                # print(each['href'])
            for each in links:
                # time.sleep(random.choice(values))
                n = crawInfoScienceDirect(each,f,count,n)
                count += 1
                n += 1
        except Exception as e:
            # print("Exception big : " + str(e))
            if("Connection aborted." in str(e) or "HTTPSConnectionPool" in str(e) or "Connection broken:" in str(e)):
                # print("Internet is down")
                time.sleep(60)
            else:
                break
    # print(arr)
    # # print(_dict)
    # print("-------------------------------------")

def crawInfoScienceDirect(input,f,count,n):
    # print("------------------------------------------------------------------------")
    headers = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'}
    url = "https://www.sciencedirect.com"+input
    response = requests.get(url, headers=headers)
    page = soup(response.content, "html.parser")
    body = page.find("body")

    #---------------------------Initialization---------------------------------------------------------
    # print(url)
    # f.write('A' + str(n) , str(count))
    # f.write('B' + str(n) , url)

    #---------------------------Title---------------------------------------------------------
    try:
        temp = [{"tag": "span", "className": {"class":"title-text"}}, {"tag":"span", "className":{"class":"reference"}}, {"tag":"h1", "className":{"class":"svTitle"}}]
        checkTitle = False
        for each in temp:
            if(checkTitle):
                break
            title = body.find(each['tag'] , each['className'])
            # print("Title : " + title.text)
            # f.write('C' + str(n) , title.text)
            _dict['title'] = title.text
            checkTitle = True
    except Exception as e:
        # print("Exception title : " + str(e))
        # f.write('C' + str(n) , 'Cannot get title')
        _dict['title'] = 'Cannot get title'
        if("Connection aborted." in str(e) or "HTTPSConnectionPool" in str(e) or "Connection broken:" in str(e)):
            # print("Internet is down")
            time.sleep(60)
    #---------------------------Journal---------------------------------------------------------
    try:
        findFieldStudy = [{"tag": "a", "className": {"class":"publication-title-link"}}, {"tag":"div", "className":{"class":"title"}}]
        done = False
        for ele in findFieldStudy:
            try:
                if(done):
                    break
                journal = body.find(ele['tag'],ele['className'])
                # print("Journal : " + journal.text)
                # f.write('D' + str(n) , journal.text)
                _dict['journal'] = journal.text
                done = True
            except:
                continue
        if(done == False):
            # print("Field of study is a picture.")
            # f.write('D' + str(n) , 'Cannot get journal')
            _dict['journal'] = 'Cannot get journal'
    except Exception as e:
        # print("Exception journal : " + str(e))
        # f.write('D' + str(n) , 'Cannot get journal')
        _dict['journal'] = 'Cannot get journal'
        if("Connection aborted." in str(e) or "HTTPSConnectionPool" in str(e) or "Connection broken:" in str(e)):
            # print("Internet is down")
            time.sleep(60)

    #---------------------------Detail---------------------------------------------------------
    ans = ""
    try:
        detail = body.find("div",{"class":"text-xs"}).text
        # print(detail)
        ans += detail
        # print("done try 1")
    except Exception as e:
        # print("Exception1 : " + str(e))
        # f.write('E' + str(n) , 'Cannot get detail')
        _dict['volume'] = 'Cannot get detail'
        if("Connection aborted." in str(e) or "HTTPSConnectionPool" in str(e) or "Connection broken:" in str(e)):
            # print("Internet is down")
            time.sleep(60)

    try:
        vol = body.find("p",{"class":"specIssueTitle"}).text
        # print(vol)
        ans += vol
        # print("done try 3")
    except Exception as e:
        # print("Exception3 : " + str(e))
        # f.write('E' + str(n) , 'Cannot get detail')
        _dict['volume'] = 'Cannot get detail'
        if("Connection aborted." in str(e) or "HTTPSConnectionPool" in str(e) or "Connection broken:" in str(e)):
            # print("Internet is down")
            time.sleep(60)

    try:
        detail = body.find("p",{"class":"volIssue"}).text
        # print(detail)
        ans += detail
        # print("done try 2")
    except Exception as e:
        # print("Exception2 : " + str(e))
        # f.write('E' + str(n) , 'Cannot get detail')
        _dict['volume'] = 'Cannot get detail'
        if("Connection aborted." in str(e) or "HTTPSConnectionPool" in str(e) or "Connection broken:" in str(e)):
            # print("Internet is down")
            time.sleep(60)

    # f.write('E' + str(n) , ans)
    _dict['volume'] = ans

    #---------------------------Authors + emails---------------------------------------------------------
    auth_n = contactInfo(f,body,n)

    #---------------------------Key words---------------------------------------------------------
    kw_n = n
    kwAns = []
    doi = ""
    findArr = [{"tag":"div","className":{"class":"keywords-section"}},{"tag":"ul","className":{"class":"keyword"}},{"tag":"div","className":{"class":"svKeywords"}}]
    alreadyDone = False
    for ele in findArr:
        try:
            if(alreadyDone):
                break
            kw = body.find(ele['tag'], ele['className'])
            temp2 = kw.findAll("span")
            alreadyDone = True
            for i in range(len(temp2)):
                kwAns.append(temp2[i].text)
                _dict['keyword'] = kwAns
                #doi number --------------------------------------------------
                doiArr = [{"class":"doi"},{"class":"S_C_ddDoi"}]
                done = False
                for ele in doiArr:
                    try:
                        if(done):
                            break
                        doi = body.find("a",ele)
                        # print(doi.text)
                        # f.write('G' + str(kw_n) , doi.text)
                        _dict['doi_number'] = doi.text
                        done = True
                    except:
                        continue
                if(done == False):
                    # print("Cannot get DOI")
                    # f.write('G' + str(kw_n) , 'Cannot get DOI')
                    _dict['doi_number'] = 'Cannot get DOI'
                #-------------------------------------------------------------
        except Exception as e:
            if("Connection aborted." in str(e) or "HTTPSConnectionPool" in str(e) or "Connection broken:" in str(e)):
                # print("Internet is down")
                time.sleep(60)
            continue
    if(alreadyDone == False):
        # print("no keywords")
        kwAns.append("no keywords")
        #doi number --------------------------------------------------
        doiArr = [{"class":"doi"},{"class":"S_C_ddDoi"}]
        done = False
        for ele in doiArr:
            try:
                if(done):
                    break
                doi = body.find("a",ele)
                # print(doi.text)
                # f.write('G' + str(kw_n), doi.text)
                _dict['doi_number'] = doi.text                
                done = True
            except Exception as e:
                # print("except : " + str(e))
                if("Connection aborted." in str(e) or "HTTPSConnectionPool" in str(e) or "Connection broken:" in str(e)):
                    # print("Internet is down")
                    time.sleep(60)
                continue
        if(done == False):
            # print("Cannot get DOI")
            # f.write('G' + str(kw_n) , 'Cannot get DOI')
            _dict['doi_number'] = 'Cannot get DOI'
        #-------------------------------------------------------------
        for each in kwAns:
            # f.write('F' + str(kw_n) , each)
            # _dict['keywords'].append(each)
            kw_n += 1
    else:
        try:
            for each in kwAns:
                # f.write('F' + str(kw_n) , each)
                # _dict['keywords'].append(each)
                kw_n += 1
        except Exception as e:
            # print("Exception kw : " + str(e))
            if("Connection aborted." in str(e) or "HTTPSConnectionPool" in str(e) or "Connection broken:" in str(e)):
                # print("Internet is down")
                time.sleep(60)
        
    collection.insert({
        'title': _dict['title'],
        'journal': _dict['journal'],
        'volume': _dict['volume'],
        'author': _dict['author'],
        'affi': _dict['affi'],
        'country': _dict['country'],
        'doi_number': _dict['doi_number'],
        'keyword': _dict['keyword']
    })

    n = max([auth_n, kw_n])
    return n

#-----------------------------------------------ScienceDirect--------------------------------------------------------------------------------
def scienceDirect(input, name, first, last):
    filename = "scienceDirect_" + name + ".xlsx"
    filepath = "csv/" + filename
    workbook = xlsxwriter.Workbook(filepath)
    f = workbook.add_worksheet()
    # init(f,input)
    n = 5
    offset = 0
    count = 1
    crawling(input, f, first, last)
    print('done!')
    print("--- %s seconds ---" % (time.time() - start_time))
    # workbook.close()

if __name__ == "__main__":
    search = ["moral", "high", "down", "low", "match", "music", "egg", "number"]

    for i, item in enumerate(search):
        start_time = time.time() # time for execute
        now = datetime.datetime.now() # now time
        # print(item)
        input = "https://www.sciencedirect.com/search?qs={}&show=50&sortBy=relevance&offset=0".format(item)
        name = "BIG"
        first = "1"
        last = "1"
        scienceDirect(input, name, first, last)