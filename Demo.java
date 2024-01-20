import com.primavera.integration.client.Session;
import com.primavera.integration.client.EnterpriseLoadManager;
import com.primavera.integration.client.RMIURL;
import com.primavera.integration.common.DatabaseInstance;
import com.primavera.integration.client.bo.BOIterator;
import com.primavera.integration.client.bo.object.Project;
public class Demo {
    public static void main( String[] args ) {
        Session session = null;
        try {
            DatabaseInstance[] dbInstances = Session.getDatabaseInstances( RMIURL.getRmiUrl(
                RMIURL.LOCAL_SERVICE ) );
            // Assume only one database instance for now, and hardcode the username and
            // password for this sample code
            session = Session.login( RMIURL.getRmiUrl( RMIURL.LOCAL_SERVICE ),
            dbInstances[0].getDatabaseId(), "admin", "admin" );
            EnterpriseLoadManager elm = session.getEnterpriseLoadManager();
            BOIterator<Project> boi = elm.loadProjects( new String[]{ "Name" }, null, "Name asc" );
            while ( boi.hasNext() ) {
                Project proj = boi.next();
                System.out.println( proj.getName() );
            }
        }
        catch ( Exception e ) {
            // Best practices would involve catching specific exceptions. To keep this
            // sample code short, we catch Exception
            e.printStackTrace();
        }
        finally {
            if ( session != null ) session.logout(); 
        }
    }
}