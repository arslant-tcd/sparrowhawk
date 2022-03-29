from knn_model import Knn
from data.getData import GetMusic

def main():
    knnModel=Knn()
    knnModel.run()
    #music=GetMusic()
    # test
    #print(music.get())

if __name__ == '__main__':
    main()