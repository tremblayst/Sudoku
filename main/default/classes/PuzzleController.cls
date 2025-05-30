public with sharing class PuzzleController {

    @AuraEnabled
    public static Puzzle__c getRandomPuzzle(){
        try {
            Integer puzzleCount = [
                SELECT Count()
                FROM Puzzle__c
                LIMIT 50000
            ];
            Integer puzzleoffset = Math.round(Math.random() * puzzleCount);
            return [select Name, StartArray__c, SolvedArray__c from Puzzle__c LIMIT:1 OFFSET:puzzleoffset];
        } catch (Exception e) {
            throw new AuraHandledException('Could not load puzzle.');
        }
    }

    @AuraEnabled
    public static void initializePuzzleData() {
        try {
            Integer puzzleCount = [
                SELECT Count()
                FROM Puzzle__c
                LIMIT 1
            ];
            if(puzzleCount == 0){
                StaticResource defaultResource = [Select Body From StaticResource where Name LIKE 'Puzzles'];
                blob tempB = defaultResource.Body;
       	        String contentFile = tempB.toString();
       	        String[] filelines = contentFile.split('\n');
    	        List<Puzzle__c> newPuzzles = new List<Puzzle__c>();
                for (Integer i=0;i<filelines.size();i++)
                {
                    Puzzle__c temp = new Puzzle__c();
                    String[] inputvalues = filelines[i].split(',');
                    temp.StartArray__c = inputValues[0];
                    temp.SolvedArray__c = inputValues[1];
                    newPuzzles.add(temp);	
                }
                insert newPuzzles;
            }
        } catch (Exception e) {
            throw new PuzzleLoadException(
                'Couldn\'t load puzzles from static resource.'
            );
        }
    }

    public class PuzzleLoadException extends Exception {
    }
}